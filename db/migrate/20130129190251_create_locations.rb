class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :city, 				:null => false, :unique => true
      t.string :country
      
      t.timestamps
    end

  end
end
