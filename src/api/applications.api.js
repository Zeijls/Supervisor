import { ENDPOINTS } from '@constants';

export class ApplicationAPI {
  constructor(Client, config) {
    this.Client = Client;
    this.config = config;
  }

  index = () => {
    return this.Client.get(ENDPOINTS.APPLICATION.INDEX).then((response) => {
      console.log('applications:', response.data);
      return response.data;
    });
  };

  store = (data) => {
    return this.Client.post(ENDPOINTS.APPLICATION.STORE, {
      ...data,
    }).then((response) => {
      console.log('api response.data', response.data);
      return response.data;
    });
  };

  show = (id) => {
    return this.Client.get(ENDPOINTS.APPLICATION.SHOW(id)).then((response) => {
      console.log('api response.data', response.data);
      return response.data;
    });
  };

  attach = (data, id) => {
    return this.Client.post(ENDPOINTS.APPLICATION.ATTACH(id), {
      ...data,
    }).then((response) => {
      console.log('attach application', response.data);
      return response.data;
    });
  };

  update = (data, id) => {
    console.log(data, 'updated data');
    return this.Client.put(ENDPOINTS.APPLICATION.UPDATE(id), {
      ...data,
    }).then((response) => {
      console.log('updata data', response.data);
      return response.data;
    });
  };

  delete = (id) => {
    return this.Client.delete(ENDPOINTS.APPLICATION.DESTROY(id)).then(
      (response) => response.data
    );
  };
}

export default ApplicationAPI;
