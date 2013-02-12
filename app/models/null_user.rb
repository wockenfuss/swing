class NullUser < ActiveRecord::Base
  attr_accessible :email, :location, :health, 
  								:grocery, :housing, :misc, :transportation,
  								:utilities

  validates :email, :presence => true

  def location
		nil
  end

  def salary
  	0
  end
end