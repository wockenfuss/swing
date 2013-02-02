class CostIndex < ActiveRecord::Base
  attr_accessible :composite, :grocery, :health, :housing, :misc, :transportation, :utilities
  belongs_to :location

  validates :composite, :presence => true

  def self.coli_database
		index ||= YAML::load(File.open('lib/coli.yaml'))
	end

	def self.from_location(location)
		puts location.inspect
	end

end
