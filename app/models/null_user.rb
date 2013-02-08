class NullUser < ActiveRecord::Base
  attr_accessible :email, :location

  validates :email, :presence => true

  def location
		nil
  end

  def salary
  	0
  end
end