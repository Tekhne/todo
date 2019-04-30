class CreateEmailAddresses < ActiveRecord::Migration[5.2]
  def change
    create_table :email_addresses do |t|
      t.references :account, foreign_key: true, null: false
      t.string :email, limit: 254, null: false
      t.boolean :confirmed, default: false, null: false

      t.timestamps
    end

    add_index :email_addresses, :email
  end
end
