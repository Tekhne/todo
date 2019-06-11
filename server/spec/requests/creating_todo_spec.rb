require 'rails_helper'
require_relative '../support/contexts/request_authentication'

RSpec.describe 'creating todo', type: :request do
  include_context 'request authentication'

  let(:login_params) do
    {
      'password' => 'S3cr3tPassw0rd!',
      'username' => 'smith'
    }.with_indifferent_access
  end

  let(:todos_params) { { 'todo' => 'do something' } }

  before do
    create_login_data login_params
    login login_params
  end

  it 'creating a todo succeeds' do
    post api_todos_path, as: :json, params: todos_params
    expect(response).to have_http_status(:created)
    expect(response.content_type).to include('json')
    expect(JSON.parse(response.body)).to have_key('message')
  end

  it 'creating a todo fails' do
    post api_todos_path, as: :json, params: {}
    expect(response).to have_http_status(:unprocessable_entity)
    expect(response.content_type).to include('json')
    json = JSON.parse(response.body)
    expect(json).to have_key('message')
    expect(json).to have_key('fieldErrors')
  end
end
