// Imports => Constants
import { ENDPOINTS } from '@constants';

export class ProfileAPI {
  constructor(Client, config) {
    this.Client = Client;
    this.config = config;
  }

  who_am_i = (data) => {
    return this.Client.get(ENDPOINTS.PROFILE.WHOAMI).then(
      (response) => response.data.data
    );
  };

  update = (data) => {
    return this.Client.post(ENDPOINTS.PROFILE.UPDATE, data).then(
      (response) => response.data.data
    );
  };

  change_active_municipality = (data) => {
    return this.Client.post(
      ENDPOINTS.PROFILE.CHANGE_ACTIVE_MUNICIPALITY,
      data
    ).then((response) => response.data.data);
  };
}

export default ProfileAPI;
