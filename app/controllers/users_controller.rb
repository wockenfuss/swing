class UsersController < ApplicationController

	before_filter :authenticate_user!

	def update
		@user = current_user
		if params[:location]
			@location = Location.find_by_city(params[:location])
			@user.update_attributes(:location => @location)
			redirect_to root_path, :notice => "Location saved."
		else
			@user.update_attributes(:salary => params[:salary])
			# redirect_to user_path(@user)
			respond_to do |format|
				format.js
			end
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
