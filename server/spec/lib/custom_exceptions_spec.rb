require 'spec_helper'

RSpec.describe CustomExceptions do
  let(:error) { 'test error' }
  let(:exception) { StandardError.new(error) }
  let(:message) { 'test message' }

  describe described_class::CustomError do
    subject(:custom_error) { described_class.new(message, original: exception) }

    it 'sets original from keyword arguments' do
      expect(custom_error.original).to eq(exception)
    end
  end

  describe described_class::ServiceError do
    subject(:service_error) do
      described_class.new(message: message, original: exception)
    end

    it 'sets message from keyword arguments' do
      expect(service_error.message).to eq(message)
    end

    it 'sets original from keyword arguments' do
      expect(service_error.original).to eq(exception)
    end
  end

  describe described_class::ParamErrors do
    subject(:param_errors) do
      described_class.new(
        errors: errors,
        message: message,
        original: exception
      )
    end

    let(:errors) { { username: ['invalid'] } }

    it 'sets message from keyword arguments' do
      expect(param_errors.message).to eq(message)
    end

    it 'sets original from keyword arguments' do
      expect(param_errors.original).to eq(exception)
    end

    it 'sets error form keyword arguments' do
      expect(param_errors.errors).to eq(errors)
    end
  end
end
