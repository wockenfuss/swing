class ApplicationController < ActionController::Base
  protect_from_forgery
	
	def request_ip
	  if Rails.env.development? 
	     response = HTTParty.get('http://api.hostip.info/get_html.php')
	     ip = response.split("\n")
	     ip.last.gsub /IP:\s+/, ''      
	   else
	     request.remote_ip
	   end 
	end

	def geo_location
		ip = request_ip
		# ip = "12.107.188.5"
		@result = Geocoder.search(ip)[0]
		file_path = "lib/assets/keys/static_map_key.txt"
		@result.data[:key] = File.read(file_path)
		return @result
	end
end
