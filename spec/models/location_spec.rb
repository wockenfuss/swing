require 'spec_helper'

describe Location do
	subject do 
		CostIndex.stub(:from_location)
		FactoryGirl.create(:location) 
	end

	it { should validate_presence_of :city }
	it { should have_many :users }
	it { should have_one :cost_index }

	[:city, :country, :latitude, :longitude].each do |attr|
		it { should respond_to attr }
	end

	describe '.from_ip_or_city' do
		it 'creates a location object from a city name' do
			Geography.stub(:city_from_city).and_return("San Francisco CA")
			location = Location.from_ip_or_city("San Francisco")
			location.city.should include "San Francisco"
		end

		it 'creates a location object from an ip address' do
			Location.stub(:request_ip)
			Geography.stub(:city_from_ip).and_return("San Francisco CA")
			location = Location.from_ip_or_city
			location.city.should include "San Francisco"
		end

		it 'does not create a location object if one already exists' do
			pending
		end
	end

end
