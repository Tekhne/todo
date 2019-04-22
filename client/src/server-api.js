export const routes = {
  // FIXME implement
};

export class ServerApi {
  async post(...args) {
    this.send('post', ...args);
  }

  async send(method, route, data) {
    // FIXME implement
  }
}

export default ServerApi;
