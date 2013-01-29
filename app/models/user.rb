class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessible :email, :password, :password_confirmation, :remember_me

  has_and_belongs_to_many :locations

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
