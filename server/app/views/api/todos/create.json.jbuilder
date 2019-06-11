json.message @message
json.fieldErrors @param_errors if @param_errors
json.todo { json.(@todo_item, :id, :description) } if @todo_item
