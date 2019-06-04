import expect from 'expect';
import { ServerApi, routes } from './ServerApi';
import { assert, fake } from 'sinon';

describe('ServerApi', function() {
  describe('send()', function() {
    const data = { test: 'test data' };
    let ajax;
    let response;
    let serverApi;

    beforeEach(function() {
      response = { data: { message: 'test message' }, status: 200 };
      ajax = fake.returns(Promise.resolve(response));
      serverApi = new ServerApi({ ajax });
    });

    describe('when given route is invalid', function() {
      it('rejects with an error', async function() {
        await expect(
          serverApi.send({ method: 'post', route: 'invalid' })
        ).rejects.toThrow(Error);
      });
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

    describe('when server request fails', function() {
      describe('when there is no server response', function() {
        it('rejects with the error encountered', async function() {
          const error = new Error('test error');
          ajax = fake.returns(Promise.reject(error));
          serverApi = new ServerApi({ ajax });
          await expect(
            serverApi.send({ data, method: 'post', route: 'signup' })
          ).rejects.toEqual(error);
        });
      });

      describe('when server response has status >= 400', function() {
        describe('when response has message', function() {
          it('rejects with response (as is)', async function() {
            response.status = 404;
            const error = new Error('test error');
            error.response = response;
            ajax = fake(() => Promise.reject(error));
            serverApi = new ServerApi({ ajax });
            await expect(
              serverApi.send({ data, method: 'post', route: 'signup' })
            ).rejects.toEqual(response);
          });
        });

        describe('when response does not have message', function() {
          it('rejects with response (with a new message)', async function() {
            response.status = 404;
            delete response.data.message;
            const error = new Error('test error');
            error.response = response;
            ajax = fake(() => Promise.reject(error));
            serverApi = new ServerApi({ ajax });
            await expect(
              serverApi.send({ data, method: 'post', route: 'signup' })
            ).rejects.toMatchObject({
              ...response,
              data: { ...response.data, message: expect.any(String) }
            });
          });
        });
      });
    });

    describe('when server request succeeds', function() {
      it('resolves with a response object', async function() {
        await expect(
          serverApi.send({ data, method: 'post', route: 'signup' })
        ).resolves.toEqual(response);
      });
    });
  });
});
