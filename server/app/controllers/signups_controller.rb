class SignupsController < ApplicationController
  def create
    Signups.new.signup(create_params)
    @message = I18n.t('signups_controller.create.success')
    respond_to { |f| f.json { render status: :created } }
  rescue Signups::ParamErrors => e
    @message = I18n.t('application_controller.common.param_errors')
    @param_errors = e.errors
    respond_to { |f| f.json { render status: :unprocessable_entity } }
  rescue Signups::ServiceError
    @message = I18n.t('application_controller.common.service_error')
    respond_to { |f| f.json { render status: :internal_server_error } }
  rescue Signups::UnconfirmedEmail
    @message = I18n.t('signups_controller.create.unconfirmed_email')
    respond_to { |f| f.json { render status: :unprocessable_entity } }
  end

  private

  def create_params
    params.permit(:email, :password, :username)
  end
end
