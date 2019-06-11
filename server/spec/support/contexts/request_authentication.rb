RSpec.shared_context 'request authentication' do
  def create_login_data(params)
    account = create(:account)

    create(
      :username_credential,
      account: account,
      password: params[:password],
      password_confirmation: params[:password],
      username: params[:username]
    )

    create(
      :email_address,
      account: account,
      confirmed: true
    )
  end

  def login(params)
    post api_login_path, as: :json, params: params
  end
end
