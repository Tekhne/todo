require 'rails_helper'

RSpec.describe Account, type: :model do
  subject(:account) { described_class.new }

  it { is_expected.to have_db_column(:status) }
  it { is_expected.to have_db_index(:status) }
  it { is_expected.to validate_presence_of(:status) }
end
