class TodoItem < ApplicationRecord
  belongs_to :account

  validates :description, presence: true
  validates :manual_priority, uniqueness: { scope: :account_id }
end
