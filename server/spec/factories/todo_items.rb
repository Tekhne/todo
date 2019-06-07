FactoryBot.define do
  factory :todo_item do
    sequence(:description) { |n| "Do task ##{n}" }
  end
end
