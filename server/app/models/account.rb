class Account < ApplicationRecord
  enum status: { active: 'active' }

  has_many :token_credentials

  validates :status, presence: true
end
