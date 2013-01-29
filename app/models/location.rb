class Location < ActiveRecord::Base
  attr_accessible :address, :city, :country, :state

  has_and_belongs_to_many :users

end
