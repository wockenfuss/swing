class Location < ActiveRecord::Base
	include Geography

  attr_accessible :city, :country, :latitude, :longitude

  has_many :users
  has_one :cost_index

  validates :city, :presence => true

	geocoded_by :city
	after_validation :geocode, :if => :city_changed?
	after_save { self.cost_index = CostIndex.from_location(self) }

	def self.from_ip
		@city_state = Geography::city_state(request_ip)
		@location = Location.find_by_city(@city_state) || Location.create(:city => @city_state)
	end

 #  def self.location_from_city(city)
 #  	result = Hash.new
	# 	latitude, longitude = Geocoder.coordinates(city)
	# 	result["latitude"] = latitude
	# 	result["longitude"] = longitude
	# 	return result
 #  end

  private
  def self.request_ip
	  if Rails.env.development? 
	     response = HTTParty.get('http://api.hostip.info/get_html.php')
	     ip = response.split("\n")
	     ip.last.gsub /IP:\s+/, ''      
	   else
	     request.remote_ip
	   end 
	end
	
end
