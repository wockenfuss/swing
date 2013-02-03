class LocationsController < ApplicationController

def show
		@user = current_user || NullUser.new
		@city = @user.home_location.city

		location = Location.from_ip_or_city(params[:city]) || @user.home_location
		location[:key] = File.read(static_map_path) if location
		location[:cost_index] = location.cost_index
		
		respond_to do |format|
			format.html
			format.json { render :json => { :location => location } } if location
		end

	end

end