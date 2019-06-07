class CreateTodoItems < ActiveRecord::Migration[5.2]
  def change
    create_table :todo_items do |t|
      t.references :account, foreign_key: true, null: false
      t.string :description, null: false

      t.timestamps
    end
  end
end
