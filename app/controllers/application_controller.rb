class ApplicationController < ActionController::Base
  protect_from_forgery

  def static_map_path
  	"lib/assets/keys/static_map_key.txt"
  end

  def request_ip
		  if Rails.env.development? 
		     response = HTTParty.get('http://api.hostip.info/get_html.php')
		     ip = response.split("\n")
		     ip.last.gsub /IP:\s+/, ''      
		   else
		     request.remote_ip
		   end 
		end
  
end
