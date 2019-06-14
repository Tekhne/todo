import axios from 'axios';
import { get, has, set } from 'lodash';

/* istanbul ignore next */
export const routes = {
  login: () => '/api/login',
  signup: () => '/api/signup',
  signupConfirmation: () => '/api/signup_confirmation',
  todos: r => (get(r, 'id') ? `/api/todos/${r.id}` : '/api/todos')
};

const STATUS_TO_ERROR = new Map([
  [404, 'The network location we sent a request to was missing.'],
  [408, 'Your network request timed out.'],
  [429, 'The network service is currently overloaded with requests.']
]);

function buildErrorMessage(response) {
  return (
    STATUS_TO_ERROR.get(response.status) || 'An unexpected error occurred.'
  );
}

export class ServerApi {
  /* istanbul ignore next */
  constructor({ ajax } = {}) {
    this.ajax = ajax || axios;
  }

  /* istanbul ignore next */
  get(args) {
    return this.send({ method: 'get', ...args });
  }

  /* istanbul ignore next */
  delete(args) {
    return this.send({ method: 'delete', ...args });
  }

  /* istanbul ignore next */
  post(args) {
    return this.send({ method: 'post', ...args });
  }

  async send({ data, method, route, routeData }) {
    if (!has(routes, route)) throw new Error(`bad route: ${route}`);
    let response;

    try {
      response = await this.ajax({
        data,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        method,
        url: routes[route](routeData)
      });
    } catch (error) {
      if (!error.response) throw error;
      response = error.response;
    }

    if (!response.status || response.status >= 400) {
      if (get(response, 'data.message')) throw response;
      set(response, 'data.message', buildErrorMessage(response));
      throw response;
    }

    return response;
  }
}

export default ServerApi;
