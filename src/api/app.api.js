// Imports => Constants
import { ENDPOINTS } from '@constants';

export class AppAPI {
  constructor(Client, config) {
    this.Client = Client;
    this.config = config;
  }

  search = (input) => {
    return this.Client.get(ENDPOINTS.APP.SEARCH, {
      params: { q: input },
    }).then((response) => response.data.data);
  };
}

export default AppAPI;
