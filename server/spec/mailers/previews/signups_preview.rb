# Preview all emails at http://localhost:<PORT>/rails/mailers/signups
class SignupsPreview < ActionMailer::Preview
  def signup
    token_credential = FactoryBot.create(:account)
      .tap { |a| FactoryBot.create(:email_address, account: a) }
      .then { |a| FactoryBot.create(:token_credential, account: a) }

    SignupsMailer.signup(token_credential)
  end
end
