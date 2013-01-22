class UsersController < ApplicationController

	before_filter :authenticate_user!, :except => [:show]


	def show
		@user = current_user
	end


end
