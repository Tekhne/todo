require 'rails_helper'

RSpec.describe HandlesExceptions do
  describe '#log_exception' do
    class Fake
      include HandlesExceptions

      def test(exception, **kwargs)
        log_exception(exception, **kwargs)
      end
    end

    def raise_and_log_exception(fake, exception, **kwargs)
      raise exception
    rescue StandardError => e
      fake.test(e, **kwargs)
      e.backtrace
    end

    subject(:fake) { Fake.new }

    let(:error) { 'test error' }
    let(:exception) { StandardError.new(error) }
    let(:logger) { instance_double(Rails.logger.class.to_s) }
    let(:message) { 'test message' }

    before do
      allow(Rails).to receive(:logger).and_return(logger)
      allow(logger).to receive(:error)
    end

    it 'logs an error prefix' do
      raise_and_log_exception fake, exception
      expect(logger).to have_received(:error).with(/\AERROR/)
    end

    context 'when message is given' do
      it 'logs message' do
        raise_and_log_exception fake, exception, message: message
        expect(logger).to have_received(:error).with(include(message))
      end
    end

    it 'logs location where exception was raised' do
      backtrace = raise_and_log_exception(fake, exception)
      location = backtrace.grep(/#{Rails.root}/).first
      expect(logger).to have_received(:error).with(include(location))
    end

    it 'logs exception class' do
      raise_and_log_exception fake, exception
      expect(logger).to \
        have_received(:error).with(include(exception.class.to_s))
    end

    context 'when exception is ActiveRecord::RecordInvalid' do
      it 'logs model errors' do
        model = Account.new.tap { |a| a.errors.add(:status, :invalid) }
        model_exception = ActiveRecord::RecordInvalid.new(model)
        raise_and_log_exception fake, model_exception
        expect(logger).to \
          have_received(:error).with(include(model.errors.to_hash.to_s))
      end
    end

    context 'when exception is not ActiveRecord::RecordInvalid' do
      it 'logs exception message' do
        raise_and_log_exception fake, exception
        expect(logger).to have_received(:error).with(include(error))
      end
    end
  end
end
