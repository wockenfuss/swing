class CreateCostIndices < ActiveRecord::Migration
  def change
    create_table :cost_indices do |t|
      t.float :composite, :null => false
      t.float :grocery
      t.float :housing
      t.float :utilities
      t.float :transportation
      t.float :health
      t.float :misc
      t.references :location

      t.timestamps
    end
  end
end
