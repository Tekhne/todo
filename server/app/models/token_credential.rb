class TokenCredential < ApplicationRecord
  enum token_type: { email_confirmation: 'email_confirmation' }

  belongs_to :account

  validates :expiration, presence: true

  has_secure_token :token
end
