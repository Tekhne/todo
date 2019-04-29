FactoryBot.define do
  factory :username_credential do
    password { 'S3cr3t!Pass0rd!' }
    sequence(:username) { |n| "username#{n}" }
  end
end
