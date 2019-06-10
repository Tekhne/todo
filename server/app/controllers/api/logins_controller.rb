class Api::LoginsController < ApplicationController
  skip_before_action :authenticate, only: %i[create destroy]

  def create
    respond_to do |format|
      format.json do
        account = Logins.new.authenticate(create_params)
        set_session_cookie(account)
        @message = I18n.t('logins_controller.create.success')
      rescue Logins::InvalidCredentials
        @message = I18n.t('logins_controller.create.invalid_credentials')
        render status: :unauthorized
      rescue Logins::UnconfirmedEmailAddress
        @message = I18n.t('logins_controller.create.unconfirmed_email_address')
        render status: :unauthorized
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @message = I18n.t('logins_controller.destroy.success')
        unset_session_cookie
      end
    end
  end

  private

  def create_params
    params.permit(:password, :username)
  end

  def set_session_cookie(account)
    session = { domain: :all }
    session[:secure] = true if Rails.env.production?

    session_expiration = Rails
      .configuration
      .server['session_timeout_seconds']
      .seconds
      .from_now

    session[:expires] = session_expiration
    value = { account_id: account.id }
    value[:expires] = session_expiration
    session[:value] = JSON.generate(value)
    cookies.encrypted[Rails.configuration.server['session_key']] = session
  end

  def unset_session_cookie
    cookies.delete Rails.configuration.server['session_key']
  end
end
