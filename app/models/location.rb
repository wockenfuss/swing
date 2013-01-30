class Location < ActiveRecord::Base
  attr_accessible :address, :city, :country, :state

  has_and_belongs_to_many :users

  validates :city, :presence => true
  #validates :country, :presence => true

  # before_validation :set_location

	geocoded_by :city
	after_validation :geocode, :if => :city_changed?
	#before_validation :

	def self.location_from_ip
			ip = request_ip
			# ip = "12.107.188.5"
			@result = Geocoder.search(ip)[0].data
			return @result
	  end

	  def self.location_from_city(city)
	  	result = Hash.new
			latitude, longitude = Geocoder.coordinates(city)
			result["latitude"] = latitude
			result["longitude"] = longitude
			return result
	  end

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
