require 'spec_helper'

describe Location do
	subject { FactoryGirl.create(:location) }

	it { should validate_presence_of :city }
	it { should have_many :users }
	it { should have_one :cost_index }

	[:city, :country, :latitude, :longitude].each do |attr|
		it { should respond_to attr }
	end

	# describe ".from_ip" do
	# 	let(:ip_location) { FactoryGirl.create(:location) }
		
	# 	it "returns an object corresponding to the current ip location" do
	# 		Geography.stub!(:city_state).and_return(ip_location.city)
	# 		Location.from_ip.should eq ip_location 
	# 	end
	# end

end
