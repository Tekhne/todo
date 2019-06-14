class Api::TodosController < ApplicationController
  def index
    respond_to do |format|
      format.json do
        @todo_items = Todos.new.list(current_account)
        @message = I18n.t('application_controller.common.success')
      rescue Todos::ServiceError
        @message = I18n.t('application_controller.common.service_error')
        render status: :internal_server_error
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        @todo_item = Todos.new.create(current_account, create_params)
        @message = I18n.t('api.todos_controller.create.success')
        render status: :created
      rescue Todos::ParamErrors => e
        @message = I18n.t('application_controller.common.param_errors')
        @param_errors = e.errors
        render status: :unprocessable_entity
      rescue Todos::ServiceError
        @message = I18n.t('application_controller.common.service_error')
        render status: :internal_server_error
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        Todos.new.destroy(current_account, destroy_params)
        @message = I18n.t('application_controller.common.success')
      rescue Todos::ParamErrors => e
        @message = I18n.t('application_controller.common.param_errors')
        @param_errors = e.errors
        render status: :unprocessable_entity
      rescue Todos::ServiceError
        @message = I18n.t('application_controller.common.service_error')
        render status: :internal_server_error
      end
    end
  end

  private

  def create_params
    params.permit(:todo)
  end

  def destroy_params
    params.permit(:id)
  end
end
