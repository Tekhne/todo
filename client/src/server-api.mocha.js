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
      ajax = fake.returns(Promise.resolve(response));
      serverApi = new ServerApi({ ajax });
    });

    it('sends request to server', async function() {
      const method = 'post';
      const route = 'signup';
      await serverApi.send({ data, method, route });
      assert.calledWith(ajax, {
        data,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        method,
        url: routes[route]()
      });
    });

    describe('when server request succeeds', function() {
      it('resolves with a response object', async function() {
        const result = await serverApi.send({
          data,
          method: 'post',
          route: 'signup'
        });
        expect(result).toEqual(response);
      });
    });

    describe('when server request fails', function() {
      it('resolves with an error response object', async function() {
        const response = {
          data: { message: 'test error message' },
          status: 500
        };
        serverApi = new ServerApi({ ajax: fake.resolves(response) });
        await expect(
          serverApi.send({ data, method: 'post', route: 'signup' })
        ).rejects.toEqual(response);
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
