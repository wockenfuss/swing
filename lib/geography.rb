module Geography

	def self.city_state(ip_address)
		result = Geocoder.search(ip_address)[0].data	
		return [result["city"], result["region_code"]]
	end	

end