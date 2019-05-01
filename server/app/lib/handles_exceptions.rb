module HandlesExceptions
  private

  def log_exception(exception, message: nil)
    error = 'ERROR'
    error << ": #{message}" if message
    location = exception.backtrace.grep(/#{Rails.root}/).first
    error << ": #{exception.class}: #{location}"

    error << if exception.is_a?(ActiveRecord::RecordInvalid)
               ": model errors: #{exception.record.errors.to_hash}"
             else
               ": #{exception}"
             end

    Rails.logger.error error
  end
end
