class ApplicationMailer < ActionMailer::Base
  default from: Rails.configuration.email_addresses[:support]
  layout 'mailer'
end
