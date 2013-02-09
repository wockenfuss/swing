class UsersController < ApplicationController

	before_filter :authenticate_user!
	# respond_to :html, :js

	def update
		@user = current_user
		if params[:location] && params[:location] != ""
			@location = Location.find_by_city(params[:location])
			@user.update_attributes( :location => @location  )
			# update_params = { :location => @location }
			# notice = "Location saved."
			flash[:notice] = "Location saved."
			js_redirect_to(root_path)
		elsif params[:salary]
			@user.update_attributes( :salary => params[:salary])
			js_alert("Salary updated.")
		end
		# @user.update_attributes( update_params )
		
		# respond_to do |format|
		# 	format.js render "shared/messages", :locals => { :notice => notice }
		# end
	end

	def show
		@user = User.find(params[:id])
	end

end
