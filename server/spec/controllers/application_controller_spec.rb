require 'rails_helper'
require_relative '../support/examples/controller/concerns/transformable_keys'

RSpec.describe ApplicationController, type: :controller do
  describe 'concerns' do
    include_examples 'controller/concerns/transformable_keys'
  end
end
