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
    begin
      param_todos = params.fetch(:todos).reduce({}) do |memo, o|
        memo.merge(
          o.fetch(:id).to_i => {
            manual_priority: o.fetch(:manual_priority).to_i
          }
        )
      end
    rescue ActionController::ParameterMissing
      raise ParamErrors.new(error: 'The ID or priority for a todo was missing.')
    end

    manual_priorities = param_todos.values.pluck(:manual_priority).sort

    if manual_priorities != manual_priorities.uniq
      raise ParamErrors.new(error: 'The todo priorities were not unique.')
    end

    todo_items = TodoItem.includes(:account).where(account: account)

    if param_todos.length != todo_items.length
      raise ParamErrors.new(
        error: 'The number of todos being changed was incorrect.'
      )
    end

    begin
      ActiveRecord::Base.transaction do
        todo_items.each do |todo_item|
          todo_item.update!(
            manual_priority: param_todos[todo_item.id][:manual_priority]
          )
        end
      end
    rescue ActiveRecord::ActiveRecordError => e
      log_exception e
      raise ServiceError.new
    end
  end
end
