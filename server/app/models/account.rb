class Account < ApplicationRecord
  enum status: { active: 'active' }

  validates :status, presence: true
end
