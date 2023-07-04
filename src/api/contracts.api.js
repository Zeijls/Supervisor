import { ENDPOINTS } from '@constants';

export class ContractsAPI {
  constructor(Client, config) {
    this.Client = Client;
    this.config = config;
  }

  index = (params) => {
    return this.Client.get(ENDPOINTS.CONTRACT.INDEX, { params }).then(
      (response) => {
        console.log('contracts:', response.data);
        return response.data;
      }
    );
  };

  search = (input) => {
    return this.Client.get(ENDPOINTS.CONTRACT.INDEX, {
      params: { q: input },
    }).then((response) => {
      console.log('search:', response.data);
      return response.data;
    });
  };

  store = (data) => {
    return this.Client.post(ENDPOINTS.CONTRACT.STORE, {
      ...data,
    }).then((response) => {
      console.log('new contract', response.data);
      return response.data.data;
    });
  };

  show = (id) => {
    return this.Client.get(ENDPOINTS.CONTRACT.SHOW(id)).then((response) => {
      console.log('get contract by id', response.data);
      return response.data;
    });
  };

  attach = (data, id) => {
    return this.Client.post(ENDPOINTS.CONTRACT.ATTACH(id), {
      ...data,
    }).then((response) => {
      console.log('add contract', response.data);
      return response.data;
    });
  };

  update = (data, id) => {
    return this.Client.put(ENDPOINTS.CONTRACT.UPDATE(id), {
      ...data,
    }).then((response) => {
      console.log('update contract', response.data);
      return response.data;
    });
  };

  delete = (id) => {
    return this.Client.delete(ENDPOINTS.CONTRACT.DESTROY(id)).then(
      (response) => response.data
    );
  };
}

export default ContractsAPI;
