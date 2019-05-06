require 'rails_helper'

describe Signups do
  describe '#signup' do
    subject(:signups) { described_class.new }

    let(:account) { instance_double('Account') }
    let(:email_address) { instance_double('EmailAddress') }
    let(:message_delivery) { instance_double('ActionMailer::MessageDelivery') }

    let(:params) do
      ActionController::Parameters.new(
        'email' => 'smith@example.com',
        'password' => 'S3cr3tPassw0rd!',
        'username' => 'smitherson'
      ).permit(:email, :password, :username)
    end

    let(:username_credential) do
      instance_double('UsernameCredential', account: account)
    end

    let(:token_credential) do
      instance_double('TokenCredential', account: account)
    end

    let(:token_credential_association_relation) do
      instance_double('TokenCredential::ActiveRecord_AssociationRelation')
    end

    before do
      allow(Account).to receive(:create!).and_return(account)
      allow(EmailAddress).to receive(:create!)
      allow(SignupsMailer).to receive(:signup).and_return(message_delivery)
      allow(TokenCredential).to receive(:create!).and_return(token_credential)
      allow(UsernameCredential).to receive(:create!)
      allow(UsernameCredential).to receive(:find_by).and_return(nil)
      allow(account).to receive(:email_address).and_return(email_address)
      allow(account).to \
        receive_message_chain(:token_credentials, :where)
        .with(token_type: :email_confirmation)
        .and_return(token_credential_association_relation)
      allow(email_address).to receive(:confirmed).and_return(false)
      allow(message_delivery).to receive(:deliver_later)
      allow(signups).to receive(:log_exception)
      allow(token_credential_association_relation).to receive(:destroy_all)
    end

    context 'when given username exists' do
      before do
        allow(UsernameCredential).to receive(:find_by) { username_credential }
      end

      context 'when associated email address is confirmed' do
        it 'raises Signups::ParamErrors' do
          allow(email_address).to receive(:confirmed).and_return(true)
          expect { signups.signup(params) }.to \
            raise_error(Signups::ParamErrors) do |error|
              expect(error.errors).to \
                include(username: [I18n.t('errors.messages.taken')])
            end
        end
      end

      context 'when associated email address is not confirmed' do
        before do
          allow(email_address).to receive(:confirmed).and_return(false)
        end

        it 'destroys all previous email confirmation token credentials' do
          begin
            signups.signup(params)
          rescue Signups::UnconfirmedEmail
            # noop
          end

          expect(token_credential_association_relation).to \
            have_received(:destroy_all)
        end

        it 'creates token credential' do
          Timecop.freeze do
            begin
              signups.signup(params)
            rescue Signups::UnconfirmedEmail
              # noop
            end

            expect(TokenCredential).to have_received(:create!).with(
              account: account,
              expiration: 1.day.from_now,
              token_type: 'email_confirmation'
            )
          end
        end

        it 'delivers signup email' do
          begin
            signups.signup(params)
          rescue Signups::UnconfirmedEmail
            # noop
          end

          expect(SignupsMailer).to have_received(:signup).with(token_credential)
          expect(message_delivery).to have_received(:deliver_later)
        end

        context 'when delivering signup email fails' do
          let(:exception) { StandardError.new('test error') }

          before do
            allow(message_delivery).to \
              receive(:deliver_later).and_raise(exception)
          end

          it 'logs exception' do
            begin
              signups.signup(params)
            rescue StandardError
              # noop
            end

            expect(signups).to have_received(:log_exception)
          end

          it 'raises Signups::ServiceError' do
            expect { signups.signup(params) }.to \
              raise_error(Signups::ServiceError)
          end
        end

        it 'raises UnconfirmedEmail' do
          expect { signups.signup(params) }.to \
            raise_error(Signups::UnconfirmedEmail)
        end
      end

      context 'when any database operations fail' do
        let(:exception) { ActiveRecord::ActiveRecordError.new }

        before do
          allow(TokenCredential).to receive(:create!).and_raise(exception)
        end

        it 'logs exception' do
          begin
            signups.signup(params)
          rescue Signups::ServiceError
            # noop
          end

          expect(signups).to have_received(:log_exception).with(exception)
        end

        it 'raises Signups::ServiceError' do
          expect { signups.signup(params) }.to \
            raise_error(Signups::ServiceError)
        end
      end
    end

    context 'when given username does not exist' do
      it 'creates account' do
        signups.signup(params)
        expect(Account).to have_received(:create!).with(status: :active)
      end

      context 'when creating account fails' do
        let(:exception) { ActiveRecord::RecordInvalid.new(Account.new) }

        before do
          allow(Account).to receive(:create!).and_raise(exception)
        end

        it 'logs exception' do
          begin
            signups.signup(params)
          rescue Signups::ServiceError
            # noop
          end

          expect(signups).to have_received(:log_exception).with(exception)
        end

        it 'raises Signups::ServiceError' do
          expect { signups.signup(params) }.to \
            raise_error(Signups::ServiceError)
        end
      end

      it 'creates username credential' do
        signups.signup(params)
        expect(UsernameCredential).to have_received(:create!).with(
          account: account,
          password: params[:password],
          password_confirmation: params[:password],
          username: params[:username]
        )
      end

      context 'when creating username credential fails' do
        let(:exception) do
          ActiveRecord::RecordInvalid.new(UsernameCredential.new)
        end

        before do
          allow(UsernameCredential).to receive(:create!).and_raise(exception)
        end

        context 'when failure is param related' do
          let(:exception) do
            model = UsernameCredential.new
            model.errors.add(:password, :invalid)
            ActiveRecord::RecordInvalid.new(model)
          end

          it 'raises ParamErrors' do
            expect { signups.signup(params) }.to \
              raise_error(Signups::ParamErrors)
          end
        end

        context 'when failure is not param related' do
          it 'logs exception' do
            begin
              signups.signup(params)
            rescue Signups::ServiceError
              # noop
            end

            expect(signups).to \
              have_received(:log_exception).with(exception)
          end

          it 'raises Signups::ServiceError' do
            expect { signups.signup(params) }.to \
              raise_error(Signups::ServiceError)
          end
        end
      end

      it 'creates email address' do
        signups.signup(params)
        expect(EmailAddress).to have_received(:create!).with(
          account: account,
          confirmed: false,
          email: params[:email]
        )
      end

      context 'when creating email address fails' do
        let(:exception) { ActiveRecord::RecordInvalid.new(EmailAddress.new) }

        before do
          allow(EmailAddress).to receive(:create!).and_raise(exception)
        end

        context 'when failure is param related' do
          let(:exception) do
            model = EmailAddress.new
            model.errors.add(:email, :invalid)
            ActiveRecord::RecordInvalid.new(model)
          end

          it 'raises ParamErrors' do
            expect { signups.signup(params) }.to \
              raise_error(Signups::ParamErrors)
          end
        end

        context 'when failure is not param related' do
          it 'logs exception' do
            begin
              signups.signup(params)
            rescue Signups::ServiceError
              # noop
            end

            expect(signups).to have_received(:log_exception).with(exception)
          end

          it 'raises Signups::ServiceError' do
            expect { signups.signup(params) }.to \
              raise_error(Signups::ServiceError)
          end
        end
      end
    end

    it 'creates token credential' do
      Timecop.freeze do
        signups.signup(params)
        expect(TokenCredential).to have_received(:create!).with(
          account: account,
          expiration: 1.day.from_now,
          token_type: 'email_confirmation'
        )
      end
    end

    context 'when creating token credential fails' do
      let(:exception) { ActiveRecord::RecordInvalid.new(TokenCredential.new) }

      before do
        allow(TokenCredential).to receive(:create!).and_raise(exception)
      end

      it 'logs exception' do
        begin
          signups.signup(params)
        rescue Signups::ServiceError
          # noop
        end

        expect(signups).to have_received(:log_exception).with(exception)
      end

      it 'raises Signups::ServiceError' do
        expect { signups.signup(params) }.to \
          raise_error(Signups::ServiceError)
      end
    end

    it 'delivers signup email' do
      signups.signup(params)
      expect(SignupsMailer).to have_received(:signup).with(token_credential)
      expect(message_delivery).to have_received(:deliver_later)
    end

    context 'when delivering signup email fails' do
      let(:exception) { StandardError.new('test error') }

      before do
        allow(message_delivery).to \
          receive(:deliver_later).and_raise(exception)
      end

      it 'logs exception' do
        begin
          signups.signup(params)
        rescue StandardError
          # noop
        end

        expect(signups).to have_received(:log_exception)
      end

      it 'raises Signups::ServiceError' do
        expect { signups.signup(params) }.to \
          raise_error(Signups::ServiceError)
      end
    end
  end
end
