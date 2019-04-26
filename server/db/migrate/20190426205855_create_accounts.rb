class CreateAccounts < ActiveRecord::Migration[5.2]
  def up
    execute "CREATE TYPE account_status AS ENUM ('active');"
    create_table :accounts, &:timestamps
    add_column :accounts, :status, :account_status, default: 'active', null: false
    add_index :accounts, :status
  end

  def down
    remove_index :accounts, :status
    drop_table :accounts
    execute 'DROP TYPE account_status;'
  end
end
