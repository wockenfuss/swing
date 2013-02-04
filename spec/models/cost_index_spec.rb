require 'spec_helper'

describe CostIndex do
	subject { FactoryGirl.create(:cost_index) }

	it { should validate_presence_of :composite }

	[:composite, :grocery, :health, :housing,
		:misc, :transportation, :utilities].each do |attr|
		it { should respond_to attr }
	end

	describe ".from_location" do
		it "creates a CostIndex instance from a valid location" do
			Coli.stub(:coli_database)
			Coli.stub(:matched_location).and_return("blurg")
			Coli.stub(:parsed_params).and_return({:composite => 123.1 })
			cost = CostIndex.from_location("San Francisco")
			cost.composite.should eq(123.1)
		end

		it "creates a null object for an invalid location" do
			Coli.stub(:coli_database)
			Coli.stub(:matched_location)
			Coli.stub(:parsed_params).and_return({:composite => 123.1 })
			cost = CostIndex.from_location("San Francisco")
			cost.composite.should eq(0.0)
		end
	end

end
