require 'spec_helper'

describe User do
	subject { FactoryGirl.create(:user) }

	it { should validate_presence_of :email }
	it { should ensure_length_of(:password).is_at_least(8) }

	[:email, :password, :password_confirmation, :remember_me].each do |attr|
		it { should respond_to attr }
	end

end
