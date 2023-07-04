import { ENDPOINTS } from '@constants';

export class ContactAPI {
  constructor(Client, config) {
    this.Client = Client;
    this.config = config;
  }

  index = (data) => {
    return this.Client.get(ENDPOINTS.CLIENT.CONTACT.INDEX).then((response) => {
      console.log('contact:', response.data);
      return response.data;
    });
  };

  store = (data) => {
    return this.Client.post(ENDPOINTS.CLIENT.CONTACT.STORE, {
      ...data,
    }).then((response) => {
      console.log('newcontact response.data', response.data);
      return response.data;
    });
  };

  show = (id) => {
    return this.Client.get(ENDPOINTS.CLIENT.CONTACT.SHOW(id)).then(
      (response) => {
        console.log('api response.data', response.data);
        return response.data;
      }
    );
  };

  attach = (data, id) => {
    return this.Client.post(ENDPOINTS.CLIENT.CONTACT.ATTACH(id), {
      ...data,
    }).then((response) => {
      console.log('api response.data', response.data);
      return response.data;
    });
  };

  update = (data, id) => {
    console.log(data, 'updated contact');
    return this.Client.put(ENDPOINTS.CLIENT.CONTACT.UPDATE(id), {
      ...data,
    }).then((response) => {
      console.log('update data', response.data);
      return response.data;
    });
  };

  delete = (id) => {
    return this.Client.delete(ENDPOINTS.CLIENT.CONTACT.DESTROY(id)).then(
      (response) => response.data
    );
  };
}

export default ContactAPI;
