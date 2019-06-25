class AddManualPriorityToTodoItems < ActiveRecord::Migration[5.2]
  def change
    add_column :todo_items, :manual_priority, :integer, null: false
    add_index :todo_items, [:account_id, :manual_priority], unique: true
  end
end
