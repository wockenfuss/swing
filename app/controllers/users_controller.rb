class UsersController < ApplicationController

	before_filter :authenticate_user!
	# respond_to :html, :js

	def update
		if params[:location] && params[:location] != ""
			@user = current_user
			@location = Location.find_by_city(params[:location])
			@user.update_attributes( :location => @location  )
			flash[:notice] = "Location saved."
			js_redirect_to(root_path)
		elsif params[:user]
			@user = User.find(params[:id])
			@user.update_attributes( params[:user] )
			js_alert("User updated.")
		end
	end

	def show
		@user = User.find(params[:id])
	end

end
