class LocationsController < ApplicationController

def show
		@user = current_user || NullUser.new
		@city = @user.home_location.city


		# if params[:city]
		# 	@location = Location.location_from_city(params[:city])
		# else
		# 	@location ||= Location.location_from_ip
		# end
		# @city = @location["city"]
		# @location[:key] = File.read(static_map_path)
		# respond_to do |format|
		# 	format.html
		# 	format.json { render :json => { :location => @location } }
		# end

	end

end