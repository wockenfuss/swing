class AddSalaryToNullUsers < ActiveRecord::Migration
  def change
    add_column :null_users, :salary, :integer, :default => 0
  end
end
