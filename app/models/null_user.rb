class NullUser < ActiveRecord::Base
  attr_accessible :email

  validates :email, :presence => true

  def home_location
		location ||= Location.from_ip_or_city
  end

end