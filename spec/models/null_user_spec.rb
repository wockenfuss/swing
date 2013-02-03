require 'spec_helper'

describe NullUser do
	subject { FactoryGirl.create :null_user }

	it { should validate_presence_of :email }

	it { should respond_to :email }
	it { should respond_to :home_location }
	
end
