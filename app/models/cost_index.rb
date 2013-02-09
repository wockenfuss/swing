class CostIndex < ActiveRecord::Base

  attr_accessible :composite, :grocery, :health, :housing, :misc, :transportation, :utilities, :location_id
  belongs_to :location

  validates :composite, :presence => true

	def self.from_location(location)
		all_indices = Coli::coli_database
		city_indices = Coli::matched_location(location, all_indices)
		if city_indices
			params =  Coli::parsed_params(city_indices, location)
			return CostIndex.create(params)
		else
			return CostIndex.null_object
		end
	end

	private
	def self.null_object
		CostIndex.create( {:composite => 0.0} )
	end

end
