require 'rails_helper'

RSpec.describe TodoItem, type: :model do
  subject(:todo_item) { described_class.new }

  context 'with a backing database' do
    it do
      expect(todo_item).to \
        have_db_column(:description)
        .of_type(:string)
        .with_options(null: false)
    end

    it do
      expect(todo_item).to \
        have_db_column(:account_id)
        .of_type(:integer)
        .with_options(foreign_key: true, null: false)
    end

    it do
      expect(todo_item).to \
        have_db_column(:manual_priority)
        .of_type(:integer)
        .with_options(null: false)
    end
  end

  context 'with associations' do
    it { is_expected.to belong_to(:account) }
  end

  context 'with validations' do
    it { is_expected.to validate_presence_of(:description) }
  end
end
