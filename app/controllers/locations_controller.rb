class LocationsController < ApplicationController

def show
		#@user = current_user if current_user
		# params[:city] = params[:city] == "" ? request_ip.to_s : params[:city]


		# @location = Location.new(:city => params[:city])
		# puts @location.inspect
		# if @location.save
		# 	puts "saved"
		# else
		# 	puts "not saved"
		# end
		# city = params[:city] || request_ip
		if params[:city]
			@location = Location.location_from_city(params[:city])
		else
			@location ||= Location.location_from_ip
		end
		@city = @location["city"]
		@location[:key] = File.read(static_map_path)

		respond_to do |format|
			format.html
			format.json { render :json => { :location => @location } }
		end
	end

end