module Geography

	def self.city_from_ip(ip_address)
		result = Geocoder.search(ip_address)[0].data	
		# result = Geocoder.search(208.113.83.165)[0].data
		return "#{result["city"]} #{result["region_code"]}"
	end	

	def self.city_from_city(city)
		result = Geocoder.search(city)[0].data["address_components"]
		return "#{result[0]["long_name"]} #{result[2]["short_name"]}"
	end

end