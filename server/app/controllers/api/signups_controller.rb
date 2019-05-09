class Api::SignupsController < ApplicationController
  def create
    respond_to do |format|
      format.json do
        begin
          Signups.new.signup(create_params)
          @message = I18n.t('signups_controller.create.success')
          render :create, status: :created
        rescue Signups::ParamErrors => e
          @message = I18n.t('application_controller.common.param_errors')
          @param_errors = e.errors
          render :create, status: :unprocessable_entity
        rescue Signups::ServiceError
          @message = I18n.t('application_controller.common.service_error')
          render :create, status: :internal_server_error
        rescue Signups::UnconfirmedEmail
          @message = I18n.t('signups_controller.create.unconfirmed_email')
          render :create, status: :unprocessable_entity
        end
      end
    end
  end

  private

  def create_params
    params.permit(:email, :password, :username)
  end
end
