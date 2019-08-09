class Api::TodosReordersController < ApplicationController
  def create
    respond_to do |format|
      format.json do
        @todo_items = Todos.new.reorder(current_account, create_params)
        @message = I18n.t('api.todos_reorders_controller.create.success')
      rescue Todos::ParamErrors => e
        @message = e.error ||
                   I18n.t('application_controller.common.param_errors')
        render status: :unprocessable_entity
      rescue Todos::ServiceError
        @message = I18n.t('application_controller.common.service_error')
        render status: :internal_server_error
      end
    end
  end

  private

  def create_params
    params.permit(todos: %i[id manual_priority])
  end
end
