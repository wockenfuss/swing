class CreateNullUsers < ActiveRecord::Migration
  def change
    create_table :null_users do |t|
 			t.string :email,              :null => false, :default => "none"
      t.string :encrypted_password, :null => false, :default => "none"
      t.timestamps
    end
  end
end
