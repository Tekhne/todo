require 'rails_helper'

RSpec.describe Api::LoginsController, type: :controller do
  describe 'POST #create' do
    let(:account) { build(:account, id: 777) }

    let(:create_params) do
      ActionController::Parameters.new(params).permit(:password, :username)
    end

    let(:logins) { instance_double('Logins') }
    let(:params) { { 'password' => 'S3cr3t!Password@', 'username' => 'smith' } }

    before do
      allow(Logins).to receive(:new).and_return(logins)
      allow(logins).to receive(:authenticate).and_return(account)
    end

    it { is_expected.to route(:post, '/api/login').to(action: :create) }

    it 'authenticates using username and password params' do
      post :create, as: :json, params: params
      expect(logins).to have_received(:authenticate).with(create_params)
    end

    context 'when authentication fails due to invalid credentials' do
      let(:exception) { Logins::InvalidCredentials.new }

      before do
        allow(logins).to receive(:authenticate).and_raise(exception)
      end

      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('logins_controller.create.invalid_credentials'))
      end

      it 'renders status :unauthorized' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when authentication fails due to unconfirmed email address' do
      let(:exception) { Logins::UnconfirmedEmailAddress }

      before do
        allow(logins).to receive(:authenticate).and_raise(exception)
      end

      it 'assigns @message' do
        post :create, as: :json, params: params
        expect(assigns(:message)).to \
          eq(I18n.t('logins_controller.create.unconfirmed_email_address'))
      end

      it 'renders status :unauthorized' do
        post :create, as: :json, params: params
        expect(response).to have_http_status(:unauthorized)
      end
    end

    it 'sets encrypted session cookie for authenticated account' do
      encrypted = instance_double('ActionDispatch::Cookies::EncryptedCookieJar')
      allow(encrypted).to receive(:[]=)
      allow(controller).to \
        receive_message_chain(:cookies, :encrypted).and_return(encrypted)

      Timecop.freeze do
        session_timeout = Rails
          .configuration
          .server['session_timeout_seconds']
          .seconds
          .from_now
        value = JSON.generate(account_id: account.id, expires: session_timeout)
        session = { expires: session_timeout, domain: :all, value: value }
        post :create, as: :json, params: params
        expect(encrypted).to \
          have_received(:[]=)
          .with(Rails.configuration.server['session_key'], session)
      end
    end

    it 'assigns @message' do
      post :create, as: :json, params: params
      expect(assigns(:message)).to \
        eq(I18n.t('logins_controller.create.success'))
    end
  end
end
