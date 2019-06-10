class Todos
  include CustomExceptions
  include HandlesExceptions

  def create(account, params)
    TodoItem.create!(account: account, description: params[:todo])
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
end
