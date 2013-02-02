class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, 
  								:remember_me

  belongs_to :home_location, :class_name => "Location"

end
