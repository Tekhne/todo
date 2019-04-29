FactoryBot.define do
  factory :token_credential do
    account_references { "MyString" }
    expiration { "2019-04-29 11:07:37" }
    token { "" }
  end
end
