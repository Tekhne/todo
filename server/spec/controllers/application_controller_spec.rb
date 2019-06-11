require 'rails_helper'

RSpec.describe ApplicationController do
  context 'with before actions' do
    describe '#authenticate' do
      controller do
        def index
          render plain: 'test'
        end
      end

      let(:account) { build(:account, id: 777) }

      let(:cookie) do
        {
          account_id: account.id,
          expires: 1.day.from_now.to_s
        }
      end

      let(:cookies) do
        instance_double('ActionDispatch::Cookies::CookieJar').as_null_object
      end

      let(:encrypted) do
        instance_double('ActionDispatch::Cookies::EncryptedCookieJar')
      end

      let(:session_string) { JSON.generate(cookie) }

      before do
        allow(Account).to receive(:find).and_return(account)
        allow(controller).to receive(:cookies).and_return(cookies)
        allow(cookies).to receive(:delete)
        allow(cookies).to receive(:encrypted).and_return(encrypted)
        allow(encrypted).to receive(:[]).and_return(session_string)
      end

      shared_examples 'renders unauthorized' do
        it 'deletes session cookie' do
          get :index, as: :json
          expect(cookies).to \
            have_received(:delete)
            .with(Rails.configuration.server['session_key'])
        end

        it 'renders JSON error message' do
          get :index, as: :json
          expect(JSON.parse(response.body)['message']).to \
            eq(I18n.t('application_controller.common.authn_error'))
        end

        it 'renders status :unauthorized' do
          get :index, as: :json
          expect(response).to have_http_status(:unauthorized)
        end
      end

      context 'when cookie session key is missing' do
        before { allow(encrypted).to receive(:[]).and_return(nil) }

        include_examples 'renders unauthorized'
      end

      context 'when session contains invalid JSON' do
        before { allow(encrypted).to receive(:[]).and_return('invalid') }

        include_examples 'renders unauthorized'
      end

      context 'when session expires key is missing' do
        let(:session_string) { JSON.generate(cookie.except(:expires)) }

        include_examples 'renders unauthorized'
      end

      context 'when session expires value is invalid date' do
        let(:session_string) do
          JSON.generate(cookie.merge('expires' => 'invalid'))
        end

        include_examples 'renders unauthorized'
      end

      context 'when session expires value is in the past' do
        let(:session_string) do
          JSON.generate(cookie.merge('expires' => 1.day.ago))
        end

        include_examples 'renders unauthorized'
      end

      context 'when session account_id key is missing' do
        let(:session_string) { JSON.generate(cookie.except(:account_id)) }

        include_examples 'renders unauthorized'
      end

      context 'when session account_id key has no matching account' do
        before do
          allow(Account).to \
            receive(:find).and_raise(ActiveRecord::RecordNotFound)
        end

        include_examples 'renders unauthorized'
      end

      context 'when session is valid and matches an existing account' do
        it 'assigns @current_account' do
          get :index, as: :json
          expect(assigns(:current_account)).to eq(account)
        end
      end
    end
  end
end
