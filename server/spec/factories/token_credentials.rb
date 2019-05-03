FactoryBot.define do
  factory :token_credential do
    expiration { 1.day.from_now }
    token_type { 'email_confirmation' }
  end
end
