json.message @message

if @todo_items
  json.todos @todo_items, :description, :id, :manual_priority
end
