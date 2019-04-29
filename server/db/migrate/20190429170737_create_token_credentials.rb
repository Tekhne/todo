class CreateTokenCredentials < ActiveRecord::Migration[5.2]
  def up
    execute "CREATE TYPE token_credential_type AS ENUM ('email_confirmation');"

    create_table :token_credentials do |t|
      t.references :account, foreign_key: true, null: false
      t.datetime :expiration, null: false
      t.string :token, null: false

      t.timestamps
    end

    add_column :token_credentials, :type, :token_credential_type, null: false

    add_index :token_credentials, :token, unique: true
    add_index :token_credentials, :type
  end

  def down
    remove_index :token_credentials, :token
    remove_index :token_credentials, :type

    drop_table :token_credentials

    execute 'DROP TYPE token_credential_type;'
  end
end
