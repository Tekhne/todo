require 'rails_helper'

RSpec.describe Api::SignupConfirmationsController, type: :controller do
  describe 'PATCH/PUT #update' do
    let(:params) { { 'token' => SecureRandom.base58 } }
    let(:signup_confirmations) { instance_double('SignupConfirmations') }

    let(:update_params) do
      ActionController::Parameters.new(params).permit(:token)
    end

    before do
      allow(SignupConfirmations).to \
        receive(:new).and_return(signup_confirmations)
      allow(signup_confirmations).to receive(:confirm)
    end

    it do
      expect(controller).to \
        route(:patch, '/api/signup_confirmation').to(action: :update)
    end

    it do
      expect(controller).to \
        route(:put, '/api/signup_confirmation').to(action: :update)
    end

    it 'confirms signup with given params' do
      patch :update, as: :json, params: params
      expect(signup_confirmations).to \
        have_received(:confirm).with(update_params)
    end

    context 'when confirming signup succeeds' do
      it 'assigns @message' do
        patch :update, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('signup_confirmations_controller.update.success'))
      end

      it 'renders status :ok' do
        patch :update, as: :json, params: params
        expect(response).to have_http_status(:ok)
      end

      it 'renders template :update' do
        patch :update, as: :json, params: params
        expect(response).to render_template(:update)
      end
    end

    context 'when confirming signup fails with param error' do
      let(:errors) { { token: [I18n.t('errors.messages.invalid')] } }
      let(:exception) { SignupConfirmations::ParamErrors.new(errors: errors) }

      before do
        allow(signup_confirmations).to receive(:confirm).and_raise(exception)
      end

      it 'assigns @message' do
        patch :update, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('application_controller.common.param_errors'))
      end

      it 'assigns @param_errors' do
        patch :update, as: :json, params: params
        expect(assigns(:param_errors)).to eq(errors)
      end

      it 'renders status :unprocessable_entity' do
        patch :update, as: :json, params: params
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'renders template :update' do
        patch :update, as: :json, params: params
        expect(response).to render_template(:update)
      end
    end

    context 'when confirming signup fails with service error' do
      let(:exception) { SignupConfirmations::ServiceError.new }

      before do
        allow(signup_confirmations).to receive(:confirm).and_raise(exception)
      end

      it 'assigns @message' do
        patch :update, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('application_controller.common.service_error'))
      end

      it 'renders status :internal_server_error' do
        patch :update, as: :json, params: params
        expect(response).to have_http_status(:internal_server_error)
      end

      it 'renders template :update' do
        patch :update, as: :json, params: params
        expect(response).to render_template(:update)
      end
    end
  end
end
