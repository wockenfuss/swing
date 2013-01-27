class UsersController < ApplicationController

	before_filter :authenticate_user!, :except => [:show]


	def show
		@user = current_user if current_user
		file_path = "#{Rails.root}/lib/assets/keys/static_map_key.txt"
		respond_to do |format|
			format.html
			format.json { render :json => { :key => File.read(file_path)}}
		end
	end


end
