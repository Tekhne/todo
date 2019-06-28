json.message @message
json.fieldErrors @param_errors if @param_errors

if @todo_item
  json.todo @todo_item, :description, :id, :manual_priority
end
