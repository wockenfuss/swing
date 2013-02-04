module Coli
	def self.coli_database
		index ||= YAML::load(File.open('lib/coli.yaml'))
	end

	def self.matched_location(location, all_indices)
		all_indices.each do |index|
			city = location.city[0..-4]
			state = location.city[-2, 2]
			if index["Urban Area"]["city"].match(city) &&
				index["Urban Area"]["state"].match(state)
				return index
			end
		end
		return nil
	end

	def self.parsed_params(index, location)
		{ :composite => index["Composite Index"], 
			:grocery => index["Grocery Items"], 
			:housing => index["Housing"], 
			:utilities => index["Utilities"], 
			:transportation => index["Transportation"], 
			:health => index["Health Care"], 
			:misc => index["Miscellaneous Goods and Services"],
			:location_id => location.id }
	end


end