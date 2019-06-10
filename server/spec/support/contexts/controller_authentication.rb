# Requires that an `account` let block is already defined.
RSpec.shared_context 'controller authentication' do
  def build_cookie_value(**kwargs)
    JSON.generate(account_id: kwargs[:account].id, expires: kwargs[:expires])
  end

  let(:cookie) do
    build_cookie_value(account: account, expires: session_expiry)
  end

  let(:cookies) do
    instance_double('ActionDispatch::Cookies::CookieJar').as_null_object
  end

  let(:encrypted_cookies) do
    instance_double('ActionDispatch::Cookies::EncryptedCookieJar')
  end

  let(:session_expiry) { 1.day.from_now.to_s }

  before do
    allow(Account).to receive(:find).with(account.id).and_return(account)
    allow(controller).to receive(:cookies).and_return(cookies)
    allow(cookies).to receive(:encrypted).and_return(encrypted_cookies)
    allow(encrypted_cookies).to \
      receive(:[])
      .with(Rails.configuration.server['session_key'])
      .and_return(cookie)
  end
end
