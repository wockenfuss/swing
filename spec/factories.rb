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

  factory :cost_index do
  	composite { (rand * 40 + 80).round(2) }
  	grocery { (rand * 40 + 80).round(2) }
  	housing { (rand * 40 + 80).round(2) }
  	utilities { (rand * 40 + 80).round(2) }
  	transportation { (rand * 40 + 80).round(2) }
  	health { (rand * 40 + 80).round(2) }
  	misc { (rand * 40 + 80).round(2) }
  end
end