class Account < ApplicationRecord
  enum status: { active: 'active' }

  has_many :token_credentials
  has_one :email_address
  has_one :username_credential

  validates :status, presence: true
end
