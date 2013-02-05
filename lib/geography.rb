module Geography

	def self.city_from_ip(ip_address)
		result = Geocoder.search(ip_address)
		if result != []
			return "#{result[0].data["city"]} #{result[0].data["region_code"]}"
			# result = Geocoder.search("208.113.83.165")[0].data
		else
			return "San Francisco CA"
		end
	end	

	def self.city_from_city(city)
		result = Geocoder.search(city)[0]
		if result
			names = result.data["formatted_address"].split(',')
			return names.join if names.pop.lstrip == "USA"
		else
			return nil
		end
	end

end