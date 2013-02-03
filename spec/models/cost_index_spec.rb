require 'spec_helper'

describe CostIndex do
	subject { FactoryGirl.create(:cost_index) }

	it { should validate_presence_of :composite }

	[:composite, :grocery, :health, :housing,
		:misc, :transportation, :utilities].each do |attr|
		it { should respond_to attr }
	end

	describe ".from_location" do
		it "creates a CostIndex instance from a location object" do
			pending "need to create database module"
		end
	end

end
