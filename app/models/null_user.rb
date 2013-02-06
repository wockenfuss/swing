class NullUser < ActiveRecord::Base
  attr_accessible :email

  validates :email, :presence => true

  def location
		location ||= Location.from_ip_or_city
  end

  def salary
  	0
  end
end