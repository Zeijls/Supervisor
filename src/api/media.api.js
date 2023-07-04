import { ENDPOINTS } from '@constants';

export class MediaAPI {
  constructor(Client, UploadClient, config) {
    this.Client = Client;
    this.config = config;
    this.Upload = UploadClient;
  }

  index = () => {
    return this.Client.get(ENDPOINTS.CONTRACT.MEDIA.INDEX).then((response) => {
      console.log('media:', response.data);
      return response.data;
    });
  };

  store = (data, id) => {
    return this.Upload.post(ENDPOINTS.CONTRACT.MEDIA.STORE(id), data).then(
      (response) => {
        console.log('new media', response.data);
        return response.data.data;
      }
    );
  };

  show = (id) => {
    return this.Client.get(ENDPOINTS.CONTRACT.MEDIA.SHOW(id)).then(
      (response) => {
        console.log('get media by id', response.data);
        return response.data;
      }
    );
  };

  attach = (data, id) => {
    return this.Client.post(ENDPOINTS.CONTRACT.MEDIA.ATTACH(id), {
      ...data,
    }).then((response) => {
      console.log('add media', response.data);
      return response.data;
    });
  };

  update = (data, id) => {
    return this.Client.put(ENDPOINTS.CONTRACT.MEDIA.UPDATE(id), {
      ...data,
    }).then((response) => {
      console.log('update media', response.data);
      return response.data;
    });
  };

  delete = (contract_id, media_id) => {
    return this.Client.delete(
      ENDPOINTS.CONTRACT.MEDIA.DESTROY(contract_id, media_id)
    ).then((response) => {
      this.index();
      console.log('delete media');
      return response.data;
    });
  };
}

export default MediaAPI;
