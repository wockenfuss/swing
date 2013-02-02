class NullUser < ActiveRecord::Base
  attr_accessible :email

  def home_location
		Location.from_ip(request_ip)
  end
end

private

def request_ip
  if Rails.env.development? 
     response = HTTParty.get('http://api.hostip.info/get_html.php')
     ip = response.split("\n")
     ip.last.gsub /IP:\s+/, ''      
   else
     request.remote_ip
   end 
end