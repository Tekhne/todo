class AddPasswordDigestTypeToUsernameCredential < ActiveRecord::Migration[5.2]
  def change
    execute <<-SQL
      CREATE TYPE username_credential_password_digest_type AS ENUM ('bcrypt');
    SQL

    add_column(
      :username_credentials,
      :password_digest_type,
      :username_credential_password_digest_type,
      default: 'bcrypt',
      null: false
    )
  end

  def down
    remove_column :username_credentials, :password_digest_type
    execute 'DROP TYPE username_credential_password_digest_type;'
  end
end
