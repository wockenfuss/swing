require 'spec_helper'

describe "Users", :js => true do
  include Warden::Test::Helpers

  describe 'users#show' do
  	let(:user) { FactoryGirl.create(:user) }
  	let(:sub_indices) { [ :housing, :grocery, :misc, 
  												:transportation, :health, :utilities ] }

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
  			page.fill_in('curSalary', :with => 50000)
  			click_button('Update')
  			visit user_path(user)
  			page.find('#curSalary').value.should eq '50000' 
  		end

  		it 'displays monthly expenses if set' do
  			sub_indices.each do |attr|
	  			user.update_attributes(attr => 1700)
	  			visit user_path(user)
	  			selector = "user_#{attr}"
	  			page.find_field( selector ).value.should eq '1700'
	  		end
  		end

  		it 'does not display monthly expenses if not set' do
				visit user_path(user)
  			sub_indices.each do |attr|
  				selector = "user_#{attr}"
	  			page.find_field( selector ).value.should eq ''
  			end
  		end

  		it 'allows user to update monthly expenses' do
  			visit user_path(user)
  			sub_indices.each do |attr|
  				selector = "user_#{attr}"
  				fill_in(selector, :with => 1000)
  			end
  			click_button('Update')
  			visit user_path(user)
  			sub_indices.each do |attr|
  				selector = "user_#{attr}"
	  			page.find_field( selector ).value.should eq '1000'
  			end
  		end
  	end

  end

end