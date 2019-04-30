FactoryBot.define do
  factory :email_address do
    sequence(:email) { |n| "smith#{n}@example.com" }
  end
end
