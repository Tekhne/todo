require 'rails_helper'

RSpec.describe Logins do
  subject(:logins) { described_class.new }

  describe '#authenticate' do
    let(:account) { build(:account, email_address: email_address) }
    let(:email_address) { build(:email_address, confirmed: true) }

    let(:params) do
      ActionController::Parameters.new(
        'password' => 'S3cr3tPassw0rd!',
        'username' => 'smith'
      ).permit(:password, :username)
    end

    let(:username_credential) { build(:username_credential, account: account) }

    before do
      allow(UsernameCredential).to \
        receive(:find_by).and_return(username_credential)
      allow(username_credential).to \
        receive(:authenticate).and_return(username_credential)
    end

    context 'when given username param is not found' do
      it 'raises Logins::InvalidCredentials' do
        allow(UsernameCredential).to receive(:find_by).and_return(nil)
        expect { logins.authenticate(params) }.to \
          raise_error(Logins::InvalidCredentials)
      end
    end

    context 'when given password param is not valid' do
      it 'raises Logins::InvalidCredentials' do
        allow(username_credential).to receive(:authenticate).and_return(false)
        expect { logins.authenticate(params) }.to \
          raise_error(Logins::InvalidCredentials)
      end
    end

    context 'when email address for username is not confirmed' do
      it 'raises Logins::UnconfirmedEmailAddress' do
        allow(email_address).to receive(:confirmed).and_return(false)
        expect { logins.authenticate(params) }.to \
          raise_error(Logins::UnconfirmedEmailAddress)
      end
    end

    it 'returns account for given username param' do
      expect(logins.authenticate(params)).to eq(account)
    end
  end
end
