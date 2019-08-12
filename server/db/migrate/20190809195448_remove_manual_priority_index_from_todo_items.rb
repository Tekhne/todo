class RemoveManualPriorityIndexFromTodoItems < ActiveRecord::Migration[5.2]
  def change
    remove_index :todo_items, [:account_id, :manual_priority]
  end
end
