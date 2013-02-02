class ApplicationController < ActionController::Base
  protect_from_forgery

  def static_map_path
  	"lib/assets/keys/static_map_key.txt"
  end
  
end
