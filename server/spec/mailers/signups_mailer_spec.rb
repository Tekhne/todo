require 'rails_helper'

RSpec.describe SignupsMailer, type: :mailer do
  describe '#signup' do
    subject(:signups_mailer) { SignupsMailer.signup(token_credential) }

    let!(:email_address) { create(:email_address, account: account) }
    let(:account) { create(:account) }
    let(:token_credential) { create(:token_credential, account: account) }

    it 'renders subject' do
      expect(signups_mailer.subject).to \
        eq(I18n.t('signups_mailer.signup.subject'))
    end

    it 'renders correct `to` addresses' do
      expect(signups_mailer.to).to eq([email_address.email])
    end

    it 'renders correct `from` addresses' do
      expect(signups_mailer.from).to \
        eq([Rails.configuration.email_addresses[:support]])
    end

    it 'renders signup confirmation URL' do
      confirmation_url =
        Rails.configuration.external_routes[:signup_confirmation_url_base] +
        token_credential.token
      expect(signups_mailer.body.encoded).to include(confirmation_url)
    end

    it 'renders root URL' do
      root_url = Rails.configuration.external_routes[:root_url]
      expect(signups_mailer.body.encoded).to include(root_url)
    end
  end
end
