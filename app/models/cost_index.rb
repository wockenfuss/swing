class CostIndex < ActiveRecord::Base
  attr_accessible :composite, :grocery, :health, :housing, :misc, :transportation, :utilities, :location_id
  belongs_to :location

  validates :composite, :presence => true

	def self.from_location(location)
		all_indices = coli_database
		city_indices = matched_location(location, all_indices)
		params =  parsed_params(city_indices, location)
		CostIndex.create(params)
	end

	private
	#pull all this out into a module
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
