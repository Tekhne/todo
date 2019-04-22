import expect from 'expect';
import { ServerApi, routes } from './server-api';
import { assert, fake } from 'sinon';

describe('ServerApi', function() {
  describe('send()', function() {
    const data = { test: 'test data' };
    const response = { data: { message: 'test message' }, status: 200 };
    let ajax;
    let serverApi;

    beforeEach(function() {
      ajax = { post: fake.returns(Promise.resolve(response)) };
      serverApi = new ServerApi({ ajax });
    });

    it('sends request to server', async function() {
      const method = 'post';
      const route = 'signup';
      await serverApi.send({ data, method, route });
      assert.calledWith(ajax[method], routes[route](), data);
    });

    describe('when server request succeeds', function() {
      it('resolves with a response object', async function() {
        const result = await serverApi.send({
          data,
          method: 'post',
          route: 'signup'
        });
        expect(result).toMatchObject({
          httpStatus: response.status,
          isError: false,
          ...response.data
        });
      });
    });

    describe('when server request fails', function() {
      it('resolves with an error response object', async function() {
        const error = {
          response: {
            data: { message: 'test error message' },
            status: 500
          }
        };
        ajax.post = fake.returns(Promise.reject(error));
        const result = await serverApi.send({
          data,
          method: 'post',
          route: 'signup'
        });
        expect(result).toMatchObject({
          httpStatus: error.response.status,
          isError: true,
          ...error.response.data
        });
      });
    });

    describe('when given route is invalid', function() {
      it('rejects with an error', async function() {
        await expect(
          serverApi.send({ method: 'post', route: 'invalid' })
        ).rejects.toThrow(Error);
      });
    });
  });
});
