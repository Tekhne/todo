require 'rails_helper'

RSpec.describe UsernameCredential, type: :model do
  subject(:username_credential) { described_class.new }

  it 'defines enum for password_digest_type' do
    expect(username_credential.defined_enums).to include('password_digest_type')
  end

  context 'with a backing database' do
    it do
      expect(username_credential).to \
        have_db_column(:account_id)
        .of_type(:integer)
        .with_options(foreign_key: true, null: false)
    end

    it do
      expect(username_credential).to \
        have_db_column(:password_digest)
        .of_type(:string)
        .with_options(null: false)
    end

    it do
      expect(username_credential).to \
        have_db_column(:password_digest_type)
        .of_type(:enum)
        .with_options(default: 'bcrypt', null: false)
    end

    it do
      expect(username_credential).to \
        have_db_column(:username)
        .of_type(:string)
        .with_options(null: false)
    end

    it { is_expected.to have_db_index(:username) }
  end

  context 'with assocations' do
    it { is_expected.to belong_to(:account) }
  end

  context 'with validations' do
    it 'ensures password has a minimum length' do
      expect(username_credential).to \
        validate_length_of(:password)
        .is_at_least(UsernameCredential::PASSWORD_LENGTH[:minimum])
    end

    it { is_expected.to validate_presence_of(:password_digest_type) }
    it { is_expected.to validate_presence_of(:username) }

    it 'ensures username is unique' do
      account = create(:account)
      username_credential = create(:username_credential, account: account)
      expect(username_credential).to validate_uniqueness_of(:username)
    end
  end

  it { is_expected.to have_secure_password }

  context 'with callbacks' do
    describe '.before_validation' do
      describe '#normalize_username' do
        it 'normalizes Unicode of username' do
          username_credential.username = "a\u0300"
          username_credential.validate
          expect(username_credential.username).to eq("\u00E0")
        end
      end
    end
  end
end
