class UsernameCredential < ApplicationRecord
  PASSWORD_LENGTH = { minimum: 10 }.freeze # OWASP guidelines

  enum password_digest_type: { bcrypt: 'bcrypt' }

  belongs_to :account

  validates :password, length: PASSWORD_LENGTH
  validates :password_digest_type, presence: true
  validates :username, presence: true
  validates :username, uniqueness: true

  before_validation :normalize_username

  has_secure_password

  def normalize_username
    return unless username
    self.username = username.unicode_normalize(:nfkc)
  end
end
