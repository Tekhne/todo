class Account < ApplicationRecord
  enum status: { active: 'active' }

  has_many :token_credentials, dependent: :destroy
  has_one :email_address, dependent: :destroy
  has_one :username_credential, dependent: :destroy

  validates :status, presence: true
end
