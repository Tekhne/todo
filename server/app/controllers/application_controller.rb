class ApplicationController < ActionController::Base
  skip_forgery_protection

  attr_accessor :current_account
  before_action :authenticate

  private

  def authenticate
    session_key = Rails.configuration.server['session_key']
    session_string = cookies.encrypted[session_key]
    render_unauthorized && return unless session_string

    begin
      session = JSON.parse(session_string)
    rescue StandardError
      render_unauthorized && return
    end

    expires_string = session['expires']
    render_unauthorized && return unless expires_string

    begin
      expires_datetime = DateTime.parse(expires_string)
    rescue ArgumentError
      render_unauthorized && return
    end

    render_unauthorized && return unless DateTime.now < expires_datetime

    account_id = session['account_id']
    render_unauthorized && return unless account_id

    begin
      self.current_account = Account.find(account_id)
    rescue ActiveRecord::RecordNotFound
      render_unauthorized && return
    end
  end

  def render_unauthorized
    cookies.delete Rails.configuration.server['session_key']

    render(
      json: { message: 'Your credentials are invalid.' },
      status: :unauthorized
    )
  end
end
