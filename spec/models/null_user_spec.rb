require 'spec_helper'

describe NullUser do
	subject { FactoryGirl.create :null_user }

	it { should validate_presence_of :email }

[:email, :location, :salary].each do |attr|
		it { should respond_to attr }
	end	
end
