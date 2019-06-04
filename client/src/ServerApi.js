import axios from 'axios';
import { get, has, set } from 'lodash';

/* istanbul ignore next */
export const routes = {
  login: () => '/api/login',
  logout: () => '/api/logout',
  signup: () => '/api/signup',
  signupConfirmation: () => '/api/signup_confirmation'
};

const STATUS_TO_ERROR = new Map([
  [404, 'The network location we sent your request to was missing.'],
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
  post(args) {
    return this.send({ method: 'post', ...args });
  }

  async send({ data, method, route }) {
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
        url: routes[route]()
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
