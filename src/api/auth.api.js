// Imports => Constants
import { ENDPOINTS } from '@constants';

export class AuthAPI {
  constructor(Client, NoAuthClient, config) {
    this.Client = Client;
    this.NoAuthClient = NoAuthClient;
    this.config = config;
  }

  login = (data) => {
    console.log(ENDPOINTS.OAUTH.LOGIN);
    return this.NoAuthClient.post(ENDPOINTS.OAUTH.LOGIN, {
      ...data,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: process.env.GRANT_TYPE,
    }).then((response) => response.data);
  };

  forgot_password = (data) => {
    return this.NoAuthClient.post(ENDPOINTS.OAUTH.FORGOT_PASSWORD, data).then(
      (response) => response.data.data
    );
  };

  reset_password = (data) => {
    return this.NoAuthClient.post(ENDPOINTS.OAUTH.RESET_PASSWORD, data).then(
      (response) => response.data.data
    );
  };
}

export default AuthAPI;
