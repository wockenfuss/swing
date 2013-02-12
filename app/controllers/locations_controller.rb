class LocationsController < ApplicationController
	respond_to :html, :json, :js

def show
		@user = current_user || NullUser.new
		if params[:city] && params[:city] != ""
			location = Location.from_city(params[:city])
		else
			location = @user.location || Location.from_ip(request_ip)
		end
		location_info = as_json(@user, location)
		respond_with(location_info)
	end

	private
	def as_json(user, location)
		key = Rails.env.production? ? ENV['SM_KEY'] : File.read(static_map_path)
		cost_index = location.cost_index if location
		# salary = user.salary
		return { :location => location,
						:key => key,
						:cost_index => cost_index,
						:user => user
						}
	end

end