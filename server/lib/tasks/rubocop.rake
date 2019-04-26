require 'rubocop/rake_task'

desc 'Run RuboCop'
RuboCop::RakeTask.new(:rubocop) do |task|
  task.patterns = [
    'app/**/*.rb',
    'lib/**/*.{rb,rake}',
    'spec/**/*.rb'
  ]
  task.fail_on_error = false
  task.requires << 'rubocop-rspec'
end
