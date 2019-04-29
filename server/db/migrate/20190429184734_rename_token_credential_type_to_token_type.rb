class RenameTokenCredentialTypeToTokenType < ActiveRecord::Migration[5.2]
  def change
    rename_column :token_credentials, :type, :token_type
  end
end
