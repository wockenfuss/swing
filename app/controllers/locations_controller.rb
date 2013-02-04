class LocationsController < ApplicationController

def show
		@user = current_user || NullUser.new

		if params[:city] && params[:city] != ""
			location = Location.from_ip_or_city(params[:city])
		else
			location = @user.home_location || Location.from_ip_or_city
		end
		if !location
			redirect_to "locations/show", flash[:alert] => "Location not found"
		else
			key = File.read(static_map_path)
			cost_index = location.cost_index
			respond_to do |format|
				format.html
				format.json { render :json => { :location => location,
																				:key => key,
																				:cost_index => cost_index
																			}} if location
			end
		end

	end

end