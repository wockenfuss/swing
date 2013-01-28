class UsersController < ApplicationController

	before_filter :authenticate_user!, :except => [:show]

	def show
		@location = geo_location
		@user = current_user if current_user

		respond_to do |format|
			format.html
			format.json { render :json => { :location => @location } }
		end
	end

end
