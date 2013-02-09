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

	describe '.from_ip' do
		it 'creates a location object from an ip address' do
			Geography.stub(:city_from_ip).and_return("San Francisco CA")
			location = Location.from_ip("foo")
			location.city.should include "San Francisco"
		end

		it 'does not create a location object if one already exists' do
			pending
		end

		it 'returns nil if it does not find the city' do
			pending
		end
	end

	describe '.from_city' do
		it 'creates a location object from a city name' do
			Geography.stub(:city_from_city).and_return("San Francisco CA")
			location = Location.from_city("San Francisco")
			location.city.should include "San Francisco"
		end
	
		it 'does not create a location object if one already exists' do
			pending
		end

		it 'returns nil if it does not find the city' do
			pending
		end
	end

end
