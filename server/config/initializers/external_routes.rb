fname = Pathname.new(File.join(File.dirname(__FILE__), 'external_routes.yml'))

Rails.configuration.tap do |c|
  c.external_routes = Rails.application.config_for(fname)[:external_routes]
end
