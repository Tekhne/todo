require 'rails_helper'

RSpec.describe SignupsController, type: :controller do
  describe 'POST #create' do
    let(:params) do
      {
        'email' => 'smith@example.com',
        'password' => 'S3cr3t!Password@',
        'username' => 'simtherson'
      }
    end

    let(:create_params) do
      ActionController::Parameters
        .new(params)
        .permit(:email, :password, :username)
    end

    let(:signups) { instance_double('Signups') }

    before do
      allow(Signups).to receive(:new).and_return(signups)
      allow(signups).to receive(:signup)
    end

    it { is_expected.to route(:post, '/signup').to(action: :create) }

    it 'signs up user with given params' do
      post :create, as: :json, params: params
      expect(signups).to \
        have_received(:signup).with(create_params).with(create_params)
    end

    context 'when signup succeeds' do
      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('signups_controller.create.success'))
      end

      it 'renders status :created' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:created)
      end
    end

    context 'when signup fails with param error' do
      let(:errors) { { username: 'is invalid' } }
      let(:exception) { Signups::ParamErrors.new(errors: errors) }

      before do
        allow(signups).to receive(:signup).and_raise(exception)
      end

      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('application_controller.common.param_errors'))
      end

      it 'assigns @param_errors' do
        post :create, as: :json, params: params
        expect(assigns(:param_errors)).to eq(errors)
      end

      it 'renders status :unprocessable_entity' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    context 'when signup fails with service error' do
      let(:exception) { Signups::ServiceError.new }

      before do
        allow(signups).to receive(:signup).and_raise(exception)
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

    context 'when signup fails with unconfirmed email' do
      let(:exception) { Signups::UnconfirmedEmail.new }

      before do
        allow(signups).to receive(:signup).and_raise(exception)
      end

      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('signups_controller.create.unconfirmed_email'))
      end

      it 'renders status :unprocessable_entity' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
