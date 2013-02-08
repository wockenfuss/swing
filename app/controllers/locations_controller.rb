class LocationsController < ApplicationController

def show
		@user = current_user || NullUser.new

		if params[:city] && params[:city] != ""
			location = Location.from_city(params[:city])
		else
			location = @user.location || Location.from_ip(request_ip)
		end

		if Rails.env.production?
			key = ENV['SM_KEY']
		else
			key = File.read(static_map_path)
		end
		cost_index = location.cost_index if location
		salary = @user.salary

		respond_to do |format|
			if location != nil
				format.html
				format.json { render :json => { :location => location,
																				:key => key,
																				:cost_index => cost_index,
																				:salary => salary
																			}}
			else
				format.js { render "errors", :locals => { :notice => "Location not found." } }
			end
		end

	end

	def index

	end

end