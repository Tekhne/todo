class SignupConfirmations
  include CustomExceptions
  include HandlesExceptions

  def confirm(params)
    token_credential = TokenCredential.find_by(token: params[:token])

    unless token_credential
      errors = { token: [I18n.t('errors.messages.invalid')] }
      raise ParamErrors.new(errors: errors)
    end

    if DateTime.now >= token_credential.expiration
      errors = { token: [I18n.t('errors.messages.invalid')] }
      raise ParamErrors.new(errors: errors)
    end

    begin
      token_credential.account.email_address.update!(confirmed: true)
      token_credential.destroy!
    rescue StandardError => e
      log_exception e
      raise ServiceError.new
    end
  end
end
