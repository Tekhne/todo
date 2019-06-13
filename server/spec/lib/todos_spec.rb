require 'rails_helper'

RSpec.describe Todos do
  subject(:todos) { described_class.new }

  describe '#create' do
    let(:account) { build(:account) }

    let(:params) do
      ActionController::Parameters.new('todo' => 'Do something.').permit(:todo)
    end

    let(:todo_item) { build(:todo_item) }

    before do
      allow(TodoItem).to receive(:create!).and_return(todo_item)
      allow(todos).to receive(:log_exception)
    end

    it 'creates todo item for given account and params' do
      todos.create(account, params)
      expect(TodoItem).to \
        have_received(:create!)
        .with(account: account, description: params[:todo])
    end

    context 'when creating todo item fails' do
      let(:exception) do
        todo_item.errors.add(:description, :invalid)
        ActiveRecord::RecordInvalid.new(todo_item)
      end

      before do
        allow(TodoItem).to receive(:create!).and_raise(exception)
      end

      context 'when failure is due to validation errors' do
        context 'when validation errors are not due to todo param' do
          let(:exception) do
            todo_item.errors.add(:account, :invalid)
            ActiveRecord::RecordInvalid.new(todo_item)
          end

          it 'logs exception' do
            begin
              todos.create(account, params)
            rescue Todos::ServiceError
              # noop
            end

            expect(todos).to have_received(:log_exception).with(exception)
          end

          it 'raises Todos::ServiceError' do
            expect { todos.create(account, params) }.to \
              raise_error(Todos::ServiceError)
          end
        end

        context 'when validation errors are due to todo param' do
          it 'raises Todos::ParamErrors' do
            expect { todos.create(account, params) }.to \
              raise_error do |error|
                expect(error).to be_a(Todos::ParamErrors)
                expect(error.errors).to \
                  include(todo: exception.record.errors[:description])
              end
          end
        end
      end

      context 'when failure is not due to validation errors' do
        let(:exception) { StandardError.new }

        before do
          allow(TodoItem).to receive(:create!).and_raise(exception)
        end

        it 'logs exception' do
          begin
            todos.create(account, params)
          rescue Todos::ServiceError
            # noop
          end

          expect(todos).to have_received(:log_exception).with(exception)
        end

        it 'raises Todos::ServiceError' do
          expect { todos.create(account, params) }.to \
            raise_error(Todos::ServiceError)
        end
      end
    end

    it 'returns created todo item' do
      expect(todos.create(account, params)).to eq(todo_item)
    end
  end

  describe '#list' do
    let(:account) { build(:account) }
    let(:todo_items_arel) { double('TodoItem::ActiveRecord_Relation') }
    let(:where_arel) { double('TodoItem::ActiveRecord_Relation') }

    before do
      allow(TodoItem).to \
        receive(:where).with(account: account).and_return(where_arel)
      allow(where_arel).to receive(:all).and_return(todo_items_arel)
    end

    it 'returns list of todos for given account' do
      expect(todos.list(account)).to eq(todo_items_arel)
    end

    context 'when searching for todos fails' do
      let(:exception) { StandardError.new }

      before do
        allow(where_arel).to receive(:all).and_raise(exception)
        allow(todos).to receive(:log_exception)
      end

      it 'logs exception' do
        begin
          todos.list(account)
        rescue Todos::ServiceError
          # noop
        end

        expect(todos).to have_received(:log_exception).with(exception)
      end

      it 'raises Todos::ServiceError' do
        expect { todos.list(account) }.to raise_error(Todos::ServiceError)
      end
    end
  end
end
