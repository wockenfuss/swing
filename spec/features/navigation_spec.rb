require 'spec_helper'

describe "Navigation" do
	include Warden::Test::Helpers
	let(:logo) { "CAN I SWING IT?" } 
	let(:root_content) { "Something here." }

	context "root path" do
		
		it "displays a link to the root path" do
			visit root_path
			page.should have_link(logo, root_path)
			page.should have_content(root_content)
		end

		context "When no one is logged in" do
			before(:each) { visit root_path }

			it "displays a sign in link that links to the sign in page" do 
				page.should have_link("Sign in", new_user_session_path)
				click_link "Sign in"
				page.should have_content("Remember me")
			end

			it "does not display a sign out link" do
				page.should_not have_content("Sign out")
			end

		end

		context "When user is logged in" do
			before(:each) do
				@user = FactoryGirl.create(:user)
	      login_as @user, :scope => :user
	      visit root_path
			end

			it "displays the user's email address in the nav bar" do
				page.should have_content(@user.email)
			end

			it "doesn't display a sign in link" do
				page.should_not have_content("Sign in")
			end

			it "displays a sign out link" do
				page.should have_content("Sign out")
			end
		end
	end

	context "sign in path" do
		before(:each) { visit new_user_session_path }

		it "displays a link to the root path" do
			page.should have_link(logo, root_path)
			click_link logo
			page.should have_content(root_content)
		end

		it "displays a link to sign up path" do
			page.should have_link("Sign up", new_user_registration_path)
			click_link("Sign up")
			page.should have_button("Sign up")
	  end

		it "displays a link to forgot your password" do
			page.should have_link "Forgot your password?"
			click_link("Forgot your password?")
			page.should have_button("Send me reset password instructions")
		end

		it "signs in a valid user" do
			@user = FactoryGirl.create(:user)
			fill_in "user[email]", :with => @user.email
			fill_in "user[password]", :with => @user.password
			click_button("Sign in")
			page.should have_content(@user.email)
		end

		it "doesn't sign in an invalid user" do
			fill_in "user[email]", :with => "blarg@example.com"
			fill_in "user[password]", :with => "bazzfazz"
			click_button("Sign in")
			page.should have_content("Invalid email or password.")
		end
	end
end