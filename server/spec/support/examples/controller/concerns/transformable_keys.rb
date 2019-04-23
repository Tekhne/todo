RSpec.shared_examples 'controller/concerns/transformable_keys' do
  describe 'TransformableKeys' do
    describe '#js_keys' do
      let(:params) { { 'the_key' => 'value' } }

      controller do
        def index
          index_params = params.permit('the_key').to_h
          key = js_keys(index_params).keys.first
          render plain: "key => <#{key}>"
        end
      end

      it 'converts hash keys to camelcase strings' do
        get :index, params: params
        expect(response.body).to eq('key => <theKey>')
      end

      describe 'when hash is not given' do
        it 'returns nil' do
          get :index, params: {}
          expect(response.body).to eq('key => <>')
        end
      end
    end

    describe '#rb_keys' do
      let(:params) { { 'theKey' => 'value' } }

      controller do
        def index
          index_params = params.permit('theKey').to_h
          key = rb_keys(index_params).keys.first
          render plain: "key => <#{key}>"
        end
      end

      it 'converts params to hash with keys as underscore symbols' do
        get :index, params: params
        expect(response.body).to eq('key => <the_key>')
      end

      describe 'when params is not given' do
        it 'returns nil' do
          get :index, params: {}
          expect(response.body).to eq('key => <>')
        end
      end
    end
  end
end
