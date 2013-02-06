class LocationsController < ApplicationController

def show
		@user = current_user || NullUser.new

		if params[:city] && params[:city] != ""
			location = Location.from_ip_or_city(params[:city])
		else
			location = @user.location || Location.from_ip_or_city
		end

		key = File.read(static_map_path)
		cost_index = location.cost_index if location
		salary = @user.salary
		respond_to do |format|
			format.html
			format.json { render :json => { :location => location,
																			:key => key,
																			:cost_index => cost_index,
																			:salary => salary
																		}}
		end

	end

	def index

	end

end