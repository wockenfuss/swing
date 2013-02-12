class AddSubIndicesToUsers < ActiveRecord::Migration
  def change
    add_column :users, :housing, :integer
    add_column :users, :grocery, :integer
    add_column :users, :misc, :integer
    add_column :users, :transportation, :integer
    add_column :users, :utilities, :integer
    add_column :users, :health, :integer
  end
end
