require 'spec_helper'

describe "Users", :js => true do
  include Warden::Test::Helpers

  describe 'users#show' do
  	let(:user) { FactoryGirl.create(:user) }
  	context 'when a user is not signed in' do
  		it 'requires the user to sign in' do
  			visit user_path(user)
  			page.should_not have_content user.email
  		end
  	end

  	context 'when a user is signed in' do
  		before(:each) do
        login_as user, :scope => :user
      end

  		it 'displays the users home location if one is set' do
  			location = FactoryGirl.create(:location)
  			user.update_attributes(:location => location )
  			visit user_path(user)
  			page.should have_css('#currentLocation span', :text => location.city)
  		end

  		it 'displays a location if one is not set' do
  			visit user_path(user)
  			page.should have_css('#currentLocation span', :text => 'None set.')
  			# page.find('#currentLocation').should have_text('None set.')
  		end

  		it 'displays a users salary if one is set' do
  			user.update_attributes(:salary => 100000)
  			visit user_path(user)
  			page.find('#curSalary').value.should eq '100000'  			
  		end

  		it 'does not display a salary if one is not set' do
  			visit user_path(user)
  			page.find('#curSalary').value.should eq ''
  		end

  		it 'allows the user to update salary' do
  			visit user_path(user)
  			fill_in('salary', :with => 50000)
  			click_button('Update')
  			visit user_path(user)
  			page.find('#curSalary').value.should eq '50000' 
  		end

  		# it 'displays user housing expenses if set' do
  		# 	user.update_attributes(:housing => 1700)
  		# 	page.should have_text '1700'
  		# end
  	end

  end

end