require 'rails_helper'

RSpec.describe SignupConfirmations do
  subject(:signup_confirmations) { described_class.new }

  let(:account) { build(:account, email_address: email_address) }
  let(:email_address) { build(:email_address) }

  let(:params) do
    ActionController::Parameters
      .new('token' => SecureRandom.base58)
      .permit(:token)
  end

  let(:token_credential) { build(:token_credential, account: account) }

  before do
    allow(TokenCredential).to receive(:find_by).and_return(token_credential)
    allow(email_address).to receive(:update!)
    allow(signup_confirmations).to receive(:log_exception)
    allow(token_credential).to receive(:destroy!)
  end

  describe '#confirm' do
    context 'when given token param is not found' do
      before do
        allow(TokenCredential).to receive(:find_by).and_return(nil)
      end

      it 'raises SignupConfirmations::ParamErrors' do
        expect { signup_confirmations.confirm(params) }.to \
          raise_error do |error|
            expect(error).to be_a(SignupConfirmations::ParamErrors)
            expect(error.errors).to include(token: [instance_of(String)])
          end
      end
    end

    context 'when given token param is expired' do
      let(:token_credential) { build(:token_credential, expiration: 1.day.ago) }

      it 'raises SignupConfirmations::ParamErrors' do
        expect { signup_confirmations.confirm(params) }.to \
          raise_error do |error|
            expect(error).to be_a(SignupConfirmations::ParamErrors)
            expect(error.errors).to include(token: [instance_of(String)])
          end
      end
    end

    it 'confirms email address associated with given token param' do
      signup_confirmations.confirm(params)
      expect(email_address).to have_received(:update!).with(confirmed: true)
    end

    context 'when confirming email address fails' do
      let(:exception) { ActiveRecord::RecordInvalid.new(email_address) }

      before do
        allow(email_address).to receive(:update!).and_raise(exception)
      end

      it 'logs exception' do
        begin
          signup_confirmations.confirm(params)
        rescue SignupConfirmations::ServiceError
          # noop
        end

        expect(signup_confirmations).to \
          have_received(:log_exception).with(exception)
      end

      it 'raises SignupConfirmations::ServiceError' do
        expect { signup_confirmations.confirm(params) }.to \
          raise_error(SignupConfirmations::ServiceError)
      end
    end

    it 'destroys token credential associated with given token param' do
      signup_confirmations.confirm(params)
      expect(token_credential).to have_received(:destroy!)
    end

    context 'when destroying token credential fails' do
      let(:exception) { ActiveRecord::RecordNotDestroyed.new }

      before do
        allow(token_credential).to receive(:destroy!).and_raise(exception)
      end

      it 'logs exception' do
        begin
          signup_confirmations.confirm(params)
        rescue SignupConfirmations::ServiceError
          # noop
        end

        expect(signup_confirmations).to \
          have_received(:log_exception).with(exception)
      end

      it 'raises SignupConfirmations::ServiceError' do
        expect { signup_confirmations.confirm(params) }.to \
          raise_error(SignupConfirmations::ServiceError)
      end
    end
  end
end
