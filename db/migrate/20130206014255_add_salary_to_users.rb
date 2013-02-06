class AddSalaryToUsers < ActiveRecord::Migration
  def change
    add_column :users, :salary, :integer, :default => 0
  end
end
