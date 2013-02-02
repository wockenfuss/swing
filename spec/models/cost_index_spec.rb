require 'spec_helper'

describe CostIndex do
	subject { FactoryGirl.create(:cost_index) }

	it { should validate_presence_of :composite }

	[:composite, :grocery, :health, :housing,
		:misc, :transportation, :utilities].each do |attr|
		it { should respond_to attr }
	end

	describe ".coli_database" do 
		it "returns a list of indices" do
			index = CostIndex.coli_database
			index.first["Urban Area"]["city"].should eq "Anniston Calhoun County"
		end
	end
end
