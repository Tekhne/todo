class TokenCredential < ApplicationRecord
  enum type: { email_confirmation: 'email_confirmation' }

  belongs_to :account

  validates :token, presence: true
  validates :expiration, presence: true

  has_secure_token
end
