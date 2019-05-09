import axios from 'axios';
import { has } from 'lodash';

export const routes = {
  signup: () => '/api/signup'
};

export class ServerApi {
  constructor({ ajax } = {}) {
    this.ajax = ajax || axios;
  }

  post(args) {
    return this.send({ method: 'post', ...args });
  }

  async send({ data, method, route }) {
    if (!has(routes, route)) throw new Error(`bad route: ${route}`);

    const response = await this.ajax({
      data,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      method,
      url: routes[route]()
    });

    if (response.status >= 400) throw response;
    return response;
  }
}

export default ServerApi;
