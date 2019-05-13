require 'rails_helper'

RSpec.describe Account, type: :model do
  subject(:account) { described_class.new }

  context 'with a database' do
    it do
      expect(account).to \
        have_db_column(:status)
        .of_type(:enum)
        .with_options(default: 'active', null: false)
    end

    it { is_expected.to have_db_index(:status) }
  end

  context 'with associations' do
    it { is_expected.to have_many(:token_credentials).dependent(:destroy) }
    it { is_expected.to have_one(:email_address).dependent(:destroy) }
    it { is_expected.to have_one(:username_credential).dependent(:destroy) }
  end

  context 'with validations' do
    it { is_expected.to validate_presence_of(:status) }
  end
end
