class Signups
  include CustomExceptions
  include HandlesExceptions

  class UnconfirmedEmail < CustomError; end

  def signup(params)
    username_credential = UsernameCredential.find_by(
      username: params[:username]
    )
    handle_existing_username username_credential if username_credential
    create_new_signup_data params
  end

  private

  def handle_existing_username(username_credential)
    account = username_credential.account

    if account.email_address.confirmed
      errors = { username: [I18n.t('errors.messages.taken')] }
      raise ParamErrors.new(errors: errors)
    end

    account.token_credentials.where(token_type: :email_confirmation).destroy_all

    token_credential = TokenCredential.create!(
      account: account,
      expiration: 1.day.from_now,
      type: 'email_confirmation'
    )

    begin
      SignupsMailer.signup(token_credential).deliver_later
    rescue StandardError => e
      log_exception e
      raise ServiceError.new
    end

    raise UnconfirmedEmail
  rescue ActiveRecord::ActiveRecordError => e
    log_exception e
    raise ServiceError.new
  end

  def create_new_signup_data(params)
    token_credential = nil

    ActiveRecord::Base.transaction do
      account = Account.create!(status: :active)

      begin
        UsernameCredential.create!(
          account: account,
          password: params[:password],
          password_confirmation: params[:password],
          username: params[:username]
        )
      rescue ActiveRecord::RecordInvalid => e
        maybe_raise_param_errors e, %i[password username]
      end

      begin
        EmailAddress.create!(
          account: account,
          confirmed: false,
          email: params[:email]
        )
      rescue ActiveRecord::RecordInvalid => e
        maybe_raise_param_errors e, %i[email]
      end

      token_credential = TokenCredential.create!(
        account: account,
        expiration: 1.day.from_now,
        type: 'email_confirmation'
      )
    end

    begin
      SignupsMailer.signup(token_credential).deliver_later
    rescue StandardError => e
      log_exception e
      raise ServiceError.new
    end
  rescue ActiveRecord::ActiveRecordError => e
    log_exception e
    raise ServiceError.new
  end

  def maybe_raise_param_errors(exception, params)
    param_errors = params
      .inject({}) { |m, k| m.merge(k => exception.record.errors[k]) }
      .select { |_, v| v.present? }
    raise ParamErrors.new(errors: param_errors) if param_errors.present?
    raise exception
  end
end
