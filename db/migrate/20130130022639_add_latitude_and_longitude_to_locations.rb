class AddLatitudeAndLongitudeToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :latitude, :float, :null => false
    add_column :locations, :longitude, :float, :null => false
  end
end
