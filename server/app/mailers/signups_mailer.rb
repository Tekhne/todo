class SignupsMailer < ApplicationMailer
  def signup(token_credential)
    @root_url = Rails.configuration.external_routes[:root_url]
    @confirmation_url =
      Rails.configuration.external_routes[:signup_confirmation_url_base] +
      token_credential.token
    mail to: token_credential.account.email_address.email
  end
end
