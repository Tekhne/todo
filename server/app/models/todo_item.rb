class TodoItem < ApplicationRecord
  belongs_to :account

  validates :description, presence: true
end
