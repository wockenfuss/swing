class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :city, 				:null => false, :default => ""
      t.string :state
      t.string :address
      t.string :country

      t.timestamps
    end

    create_table(:locations_users, :id => false) do |t|
    	t.references :user
    	t.references :location 
    end

  end
end
