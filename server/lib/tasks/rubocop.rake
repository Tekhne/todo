require 'rubocop/rake_task'

desc 'Run RuboCop'
RuboCop::RakeTask.new(:rubocop) do |task|
  task.patterns = [ 'app/**/*.rb', 'spec/**/*.rb' ]
  task.formatters = ['files']
  task.fail_on_error = false
end
