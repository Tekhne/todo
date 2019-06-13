require 'rails_helper'
require_relative '../../support/contexts/controller_authentication'

RSpec.describe Api::TodosController, type: :controller do
  include_context 'controller authentication'

  let(:account) { build(:account, id: 777) }
  let(:todos) { instance_double('Todos') }

  before do
    allow(Todos).to receive(:new).and_return(todos)
  end

  describe 'GET #index' do
    let(:todo_items_arel) { double('TodoItem::ActiveRecord_Relation') }

    before do
      allow(todos).to receive(:list).and_return(todo_items_arel)
    end

    it { is_expected.to route(:get, '/api/todos').to(action: :index) }

    it 'assigns @todo_items' do
      get :index, as: :json
      expect(assigns(:todo_items)).to eq(todo_items_arel)
    end

    it 'assigns @message' do
      get :index, as: :json
      expect(assigns(:message)).to \
        eq(I18n.t('application_controller.common.success'))
    end

    context 'when generating list of todo items fails' do
      before do
        allow(todos).to receive(:list).and_raise(Todos::ServiceError.new)
      end

      it 'assigns @message' do
        get :index, as: :json
        expect(assigns(:message)).to \
          eq(I18n.t('application_controller.common.service_error'))
      end

      it 'renders status :internal_server_error' do
        get :index, as: :json
        expect(response).to have_http_status(:internal_server_error)
      end
    end
  end

  describe 'POST #create' do
    let(:create_params) do
      ActionController::Parameters.new(params).permit(:todo)
    end

    let(:params) { { 'todo' => 'do something' } }
    let(:todo_item) { build(:todo_item) }

    before do
      allow(todos).to receive(:create).and_return(todo_item)
    end

    it { is_expected.to route(:post, '/api/todos').to(action: :create) }

    it 'creates new todo' do
      post :create, as: :json, params: params
      expect(todos).to \
        have_received(:create).with(account, create_params)
    end

    describe 'when creating new todo succeeds' do
      it 'assigns @todo_item with created todo' do
        post :create, as: :json, params: params
        expect(assigns(:todo_item)).to eq(todo_item)
      end

      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('api.todos_controller.create.success'))
      end

      it 'renders status :created' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:created)
      end
    end

    describe 'when creating new todo fails with param error' do
      let(:exception) do
        Todos::ParamErrors.new(errors: { todo: ['is invalid'] })
      end

      before { allow(todos).to receive(:create).and_raise(exception) }

      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('application_controller.common.param_errors'))
      end

      it 'assigns @param_errors' do
        post :create, as: :json, params: params
        expect(assigns(:param_errors)).to eq(exception.errors)
      end

      it 'renders status :unprocessable_entity' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when creating new todo fails with service error' do
      let(:exception) { Todos::ServiceError.new }

      before { allow(todos).to receive(:create).and_raise(exception) }

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
