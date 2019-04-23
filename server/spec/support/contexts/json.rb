RSpec.shared_context :json do
  RSpec::Matchers.define :have_json_response do |status|
    match do |response|
      # XXX probably shouldn't have expectations in here
      expect(response).to have_http_status(status)
      expect(response.content_type).to eq('application/json')
      expect(JSON.parse(response.body)).to have_key('message')
      true
    end
  end

  let(:json_headers) do
    {
      'Accept' => 'application/json',
      'Content-Type' => 'application/json'
    }
  end
end
