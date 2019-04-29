class CreateUsernameCredentials < ActiveRecord::Migration[5.2]
  def change
    create_table :username_credentials do |t|
      t.references :account, foreign_key: true, null: false
      t.string :password_digest, null: false
      t.string :username, null: false

      t.timestamps
    end
    add_index :username_credentials, :username, unique: true
  end
end
