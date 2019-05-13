require 'rails_helper'

RSpec.describe TokenCredential, type: :model do
  subject(:token_credential) { described_class.new }

  it 'defines an enum for type' do
    expect(token_credential.defined_enums).to include('token_type')
  end

  context 'with a backing database' do
    it do
      expect(token_credential).to \
        have_db_column(:account_id)
        .of_type(:integer)
        .with_options(foreign_key: true, null: false)
    end

    it do
      expect(token_credential).to \
        have_db_column(:expiration)
        .of_type(:datetime)
        .with_options(null: false)
    end

    it do
      expect(token_credential).to \
        have_db_column(:token)
        .of_type(:string)
        .with_options(null: false)
    end

    it do
      expect(token_credential).to \
        have_db_column(:token_type)
        .of_type(:enum)
        .with_options(null: false)
    end

    it { is_expected.to have_db_index(:token).unique }
    it { is_expected.to have_db_index(:token_type) }
  end

  context 'with assocations' do
    it { is_expected.to belong_to(:account) }
  end

  context 'with validations' do
    it { is_expected.to validate_presence_of(:expiration) }
  end

  it { is_expected.to have_secure_token(:token) }
end
