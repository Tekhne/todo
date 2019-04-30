require 'rails_helper'

RSpec.describe EmailAddress, type: :model do
  subject(:email_address) { described_class.new }

  context 'with a database' do
    it do
      expect(email_address).to \
        have_db_column(:account_id)
        .of_type(:integer)
        .with_options(foreign_key: true, null: false)
    end

    it do
      expect(email_address).to \
        have_db_column(:email)
        .of_type(:string)
        .with_options(limit: 254, null: false)
    end

    it do
      expect(email_address).to \
        have_db_column(:confirmed)
        .of_type(:boolean)
        .with_options(default: false, null: false)
    end

    it { is_expected.to have_db_index(:email) }
  end

  context 'with associations' do
    it { is_expected.to belong_to(:account) }
  end

  context 'with validations' do
    it do
      expect(email_address).not_to \
        allow_values('invalid', 'invalid@example', '@invalid').for(:email)
    end

    it 'validates email is at most 254 characters long' do
      email_address.email = 'a' * 243 + '@example.com'
      email_address.validate
      expect(email_address.errors[:email]).to be_present
    end

    it { is_expected.to validate_presence_of(:confirmed) }
  end
end
