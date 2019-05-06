require 'rails_helper'

RSpec.describe 'signing up', type: :request do
  let(:params) do
    {
      'email' => 'smith@example.com',
      'password' => 'S0methingS3cr3t!',
      'username' => 'smitherson'
    }
  end

  it 'signup succeeds' do
    post signup_path, as: :json, params: params
    expect(response).to have_http_status(:created)
    expect(response.content_type).to include('json')
    expect(JSON.parse(response.body)).to have_key('message')
  end

  it 'signup fails' do
    post signup_path, as: :json, params: params.except('email')
    expect(response).to have_http_status(:unprocessable_entity)
    expect(response.content_type).to include('json')
    expect(JSON.parse(response.body)['fieldErrors']).to include('email')
  end
end
