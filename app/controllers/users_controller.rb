class UsersController < ApplicationController

	before_filter :authenticate_user!, :except => [:show]

	# def show
	# 	@user = current_user if current_user
	# 	puts params.inspect
	# 	if params[:city]
	# 		@location = User.location_from_city(params[:city])
	# 	else
	# 		@location = User.location_from_ip
	# 	end
	# 	@city ||= @location["city"]
	# 	file_path = "lib/assets/keys/static_map_key.txt"
	# 	@location[:key] = File.read(file_path)

	# 	respond_to do |format|
	# 		format.html
	# 		format.json { render :json => { :location => @location } }
	# 	end
	# end

end
