import axios from 'axios';
import { has } from 'lodash';

export const routes = {
  signup: () => '/api/signup'
};

export class ServerApi {
  constructor({ ajax } = {}) {
    this.ajax = ajax || axios;
  }

  async post(args) {
    this.send({ method: 'post', ...args });
  }

  async send({ data, method, route }) {
    if (!has(routes, route)) throw new Error(`bad route: ${route}`);
    let response;

    try {
      response = await this.ajax[method](routes[route](), data);
    } catch (error) {
      response = error.response;
    }

    response = response || {};

    return {
      httpStatus: response.status,
      isError: response.status >= 400,
      ...response.data
    };
  }
}

export default ServerApi;
