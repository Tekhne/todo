require 'rails_helper'
require_relative '../../support/contexts/controller_authentication'

RSpec.describe Api::TodosReordersController, type: :controller do
  include_context 'controller authentication'

  let(:account) { build(:account, id: 777) }

  describe 'POST #create' do
    let(:create_params) do
      ActionController::Parameters
        .new(params)
        .permit(todos: %i[id manual_priority])
    end

    let(:params) do
      {
        todos: [
          { id: 777, manual_priority: 1 },
          { id: 778, manual_priority: 2 }
        ]
      }
    end

    let(:todo_items) { build_list(:todo_item, 3) }
    let(:todos) { instance_double('Todos') }

    before do
      allow(Todos).to receive(:new).and_return(todos)
      allow(todos).to receive(:reorder).and_return(todo_items)
    end

    it do
      expect(controller).to \
        route(:post, '/api/todos_reorders').to(action: :create)
    end

    it 'reorders todos' do
      post :create, as: :json, params: params
      expect(todos).to have_received(:reorder).with(account, create_params)
    end

    context 'when creating todo reorder succeeds' do
      it 'assigns @todo_items with reordered todos' do
        post :create, as: :json, params: params
        expect(assigns(:todo_items)).to eq(todo_items)
      end

      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('api.todos_reorders_controller.create.success'))
      end

      it 'renders status :ok' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when creating todo reorder fails due to param errors' do
      let(:exception) { Todos::ParamErrors.new(error: 'test error') }

      before do
        allow(todos).to receive(:reorder).and_raise(exception)
      end

      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to eq(exception.error)
      end

      it 'renders status :unprocessable_entity' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when creating todo reorder fails due to service errors' do
      let(:exception) { Todos::ServiceError.new }

      before do
        allow(todos).to receive(:reorder).and_raise(exception)
      end

      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('application_controller.common.service_error'))
      end

      it 'renders status :internal_server_error' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:internal_server_error)
      end
    end
  end
end
