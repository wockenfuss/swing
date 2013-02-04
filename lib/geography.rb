module Geography

	def self.city_from_ip(ip_address)
		result = Geocoder.search(ip_address)[0].data	
		# result = Geocoder.search(208.113.83.165)[0].data
		return "#{result["city"]} #{result["region_code"]}"
	end	

	def self.city_from_city(city)
		result = Geocoder.search(city)[0]
		if result
			names = result.data["address_components"]
			return "#{names[0]["long_name"]} #{names[2]["short_name"]}"
		else
			return nil
		end
	end

end