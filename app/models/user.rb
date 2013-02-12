class User < ActiveRecord::Base
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, 
  								:remember_me, :location, :salary, :health, 
  								:grocery, :housing, :misc, :transportation,
  								:utilities

  belongs_to :location

end
