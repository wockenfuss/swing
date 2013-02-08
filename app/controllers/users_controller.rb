class UsersController < ApplicationController

	before_filter :authenticate_user!

	def update
		@user = current_user
		if params[:location]
			@location = Location.find_by_city(params[:location])
			update_params = { :location => @location }
			notice = "Location saved."
		else
			update_params = { :salary => params[:salary] }
			notice = "Salary updated."
		end
		if @user.update_attributes( update_params )
			notice = notice
		else
			notice = "Something went wrong."
		end
		respond_to do |format|
			format.js { render "shared/messages", :locals => { :notice => notice } }
		end

	end

	def show
		@user = User.find(params[:id])

		respond_to do |format|
			format.js
			format.html
		end

	end

end
