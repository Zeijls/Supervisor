import { ENDPOINTS } from '@constants';

export class ClientsAPI {
  constructor(Client, config) {
    this.Client = Client;
    this.config = config;
  }

  index = (params) => {
    return this.Client.get(ENDPOINTS.CLIENT.INDEX, { params }).then(
      (response) => {
        console.log('clients:', response.data);
        return response.data;
      }
    );
  };

  search = (input) => {
    return this.Client.get(ENDPOINTS.CLIENT.INDEX, {
      params: { q: input },
    }).then((response) => {
      console.log('search:', response.data);
      return response.data;
    });
  };

  store = (data) => {
    return this.Client.post(ENDPOINTS.CLIENT.STORE, {
      ...data,
    }).then((response) => {
      console.log('new client', response.data);
      return response.data.data;
    });
  };

  show = (id) => {
    return this.Client.get(ENDPOINTS.CLIENT.SHOW(id)).then((response) => {
      console.log('get client by id', response.data);
      return response.data;
    });
  };

  attach = (data, id) => {
    return this.Client.post(ENDPOINTS.CLIENT.ATTACH(id), {
      ...data,
    }).then((response) => {
      console.log('add data', response.data);
      return response.data;
    });
  };

  update = (data, id) => {
    return this.Client.put(ENDPOINTS.CLIENT.UPDATE(id), {
      ...data,
    }).then((response) => {
      console.log('update data', response.data);
      return response.data.data;
    });
  };

  delete = (id) => {
    return this.Client.delete(ENDPOINTS.CLIENT.DESTROY(id)).then(
      (response) => response.data
    );
  };
}

export default ClientsAPI;
