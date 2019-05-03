# Preview all emails at http://localhost:3000/rails/mailers/signups
class SignupsPreview < ActionMailer::Preview
  def signup
    account = FactoryBot.create(:account)
    email_address = FactoryBot.create(:email_address, account: account)
    token_credential = FactoryBot.create(:token_credential, account: account)
    SignupsMailer.signup(token_credential)
  end
end
