class Api::SignupConfirmationsController < ApplicationController
  def update
    respond_to do |format|
      format.json do
        SignupConfirmations.new.confirm(update_params)
        @message = I18n.t('signup_confirmations_controller.update.success')
      rescue SignupConfirmations::ParamErrors => e
        @message = I18n.t('application_controller.common.param_errors')
        @param_errors = e.errors
        render :update, status: :unprocessable_entity
      rescue SignupConfirmations::ServiceError
        @message = I18n.t('application_controller.common.service_error')
        render :update, status: :internal_server_error
      end
    end
  end

  private

  def update_params
    params.permit(:token)
  end
end
