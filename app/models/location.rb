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
			return Location.find_by_city(@city) || Location.create(:city => @city)
		else
			return nil
		end
	end

	def self.from_city(city)
		@city = Geography::city_from_city(city)
		if @city
			return Location.find_by_city(@city) || Location.create(:city => @city)
		else
			return nil
		end
	end

	# def self.from_ip_or_city(city = nil)
	# 	@city = city ? Geography::city_from_city(city) : Geography::city_from_ip(request_ip)
	# 	if @city
	# 		return Location.find_by_city(@city) || Location.create(:city => @city)
	# 	else
	# 		return nil
	# 	end
	# end

	# private
	# def self.request_ip
	#   if Rails.env.development? 
	#      response = HTTParty.get('http://api.hostip.info/get_html.php')
	#      ip = response.split("\n")
	#      ip.last.gsub(/IP:\s+/, '')      
	#    else
	#      request.remote_ip
	#    end 
	# end
	
end
