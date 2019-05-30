Rails.configuration.tap do |c|
  c.server = Rails
    .application
    .config_for(
      Pathname.new(File.join(File.dirname(__FILE__), 'server.yml'))
    )
end
