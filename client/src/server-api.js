import axios from 'axios';
import { get, has, set } from 'lodash';

/* istanbul ignore next */
export const routes = {
  login: () => '/api/login',
  signup: () => '/api/signup'
};

/* istanbul ignore next */
function buildErrorMessage(response) {
  switch (response.status) {
    case 404:
      return 'The location we sent your request to is missing.';
    case 408:
      return 'Your request timed out.';
    case 429:
      return 'The service is currently overloaded with requests.';
    default:
      return 'An unexpected error occurred.';
  }
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

    if (response.status >= 400) {
      if (get(response, 'data.message')) throw response;
      set(response, 'data.message', buildErrorMessage(response));
      throw response;
    }

    return response;
  }
}

export default ServerApi;
