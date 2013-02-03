class NullUser < ActiveRecord::Base
  attr_accessible :email

  validates :email, :presence => true

  def home_location
		Location.from_ip
  end

end