class Location < ActiveRecord::Base

  attr_accessible :city, :country, :latitude, :longitude

  has_many :users
  has_one :cost_index

  validates :city, :presence => true

	geocoded_by :city
	after_validation :geocode, :if => :city_changed?
	after_save { self.cost_index = CostIndex.from_location(self) }

	def self.from_ip(ip_address)
		@city = Geography::city_from_ip(ip_address)
		if @city
			return Location.find_or_create_by_city(@city)
		else
			return nil
		end
	end

	def self.from_city(city)
		@city = Geography::city_from_city(city)
		if @city
			return Location.find_or_create_by_city(@city)
		else
			return nil
		end
	end
	
end
