fname = Pathname.new(File.join(File.dirname(__FILE__), 'email.yml'))
email_config = Rails.application.config_for(fname)
default_url_options = email_config[:action_mailer][:default_url_options]
email_addresses = email_config[:email_addresses]

Rails.configuration.tap do |c|
  c.action_mailer.default_url_options = default_url_options
  c.email_addresses = email_addresses
end
