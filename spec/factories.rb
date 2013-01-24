FactoryGirl.define do
  factory :user do
    email { Faker::Internet.email }
    password "awesome1"
  end

  # factory :admin, class: User do
  #   first_name "Admin"
  #   last_name  "User"
  #   admin      true
  # end
end