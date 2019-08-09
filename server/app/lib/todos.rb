class Todos
  include CustomExceptions
  include HandlesExceptions

  def create(account, params)
    # FIXME: avoid a manual_priority race condition in a performant way

    old_maximum_manual_priority = TodoItem
      .where(account: account)
      .maximum(:manual_priority)

    new_maximum_manual_priority = (old_maximum_manual_priority || 0) + 1

    TodoItem.create!(
      account: account,
      description: params[:todo],
      manual_priority: new_maximum_manual_priority
    )
  rescue ActiveRecord::RecordInvalid => e
    unless e.record.errors[:description].present?
      log_exception e
      raise ServiceError.new
    end

    raise ParamErrors.new(errors: { todo: e.record.errors[:description] })
  rescue StandardError => e
    log_exception e
    raise ServiceError.new
  end

  def list(account)
    TodoItem.where(account: account).all
  rescue StandardError => e
    log_exception e
    raise ServiceError.new
  end

  def destroy(account, params)
    TodoItem.find_by!(account: account, id: params[:id]).destroy!
  rescue ActiveRecord::RecordNotFound
    raise ParamErrors.new(errors: { id: I18n.t('errors.messages.invalid') })
  rescue StandardError => e
    log_exception e
    raise ServiceError.new
  end

  def reorder(account, params)
    param_todos = params.fetch(:todos).reduce({}) do |memo, o|
      memo.merge(
        o.fetch(:id).to_i => {
          manual_priority: o.fetch(:manual_priority).to_i
        }
      )
    end

    ActiveRecord::Base.transaction do
      TodoItem
        .where(account: account, id: param_todos.keys)
        .each do |todo_item|
          todo_item.update!(
            manual_priority: param_todos[todo_item.id][:manual_priority]
          )
        end
    end
  rescue ActionController::ParameterMissing
    raise ParamErrors.new(error: 'The ID or priority for a todo was missing.')
  rescue StandardError => e
    log_exception e
    raise ServiceError.new
  end
end
