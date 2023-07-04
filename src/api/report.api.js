import { ENDPOINTS } from '@constants';

export class ReportAPI {
  constructor(Client, config) {
    this.Client = Client;
    this.config = config;
  }

  index = (params) => {
    return this.Client.get(ENDPOINTS.LOG.REPORT.INDEX, { params }).then(
      (response) => {
        console.log('REPORT:', response.data);
        return response.data;
      }
    );
  };

  search = (input) => {
    return this.Client.get(ENDPOINTS.LOG.REPORT.INDEX, {
      params: { q: input },
    }).then((response) => {
      console.log('search:', response.data);
      return response.data;
    });
  };

  store = (data) => {
    return this.Client.post(ENDPOINTS.LOG.REPORT.STORE, {
      ...data,
    }).then((response) => {
      console.log('new LOG.REPORT', response.data);
      return response.data.data;
    });
  };

  show = (id) => {
    return this.Client.get(ENDPOINTS.LOG.REPORT.SHOW(id)).then((response) => {
      console.log('get LOG.REPORT by id', response.data);
      return response.data;
    });
  };

  attach = (data, id) => {
    return this.Client.post(ENDPOINTS.LOG.REPORT.ATTACH(id), {
      ...data,
    }).then((response) => {
      console.log('add LOG.REPORT', response.data);
      return response.data;
    });
  };

  update = (data, id) => {
    return this.Client.put(ENDPOINTS.LOG.REPORT.UPDATE(id), {
      ...data,
    }).then((response) => {
      console.log('update LOG.REPORT', response.data);
      return response.data;
    });
  };

  delete = (id) => {
    return this.Client.delete(ENDPOINTS.LOG.REPORT.DESTROY(id)).then(
      (response) => response.data
    );
  };
}

export default ReportAPI;
