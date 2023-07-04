// Imports => Vendor
import axios from 'axios';

// Imports => Dependencies
import { makeObservable, observable, computed, action } from 'mobx';
import moment from 'moment';

// Imports => Config
import config from '@config';

// Imports => Constants
import { KEYS } from '@constants';

// Imports => Utilities
import {
  AcSanitize,
  AcAutoLoad,
  AcAutoSave,
  AcGetState,
  AcSaveState,
  AcRemoveState,
  AcClearState,
  AcIsSet,
  AcIsUndefined,
  AcFormatErrorMessage,
  AcGetAccessToken,
} from '@utils';

let app = {};
let timer = null;

export class AuthStore {
  constructor(store) {
    makeObservable(this);

    AcAutoLoad(this, KEYS.ACCOUNT);
    AcAutoLoad(this, KEYS.ACCESS_TOKEN);
    AcAutoLoad(this, KEYS.EXPIRES_IN);
    AcAutoLoad(this, KEYS.EXPIRES_AT);
    AcAutoLoad(this, KEYS.REFRESH_TOKEN);
    AcAutoSave(this);

    moment.locale(config.locale);

    app.store = store;

    window.addEventListener('unAuthenticate', this.unAuthenticate, {
      passive: true,
    });
  }

  @observable redirect_url = null;

  @observable access_token = null;

  @observable expires_in = null;

  @observable expires_at = null;

  @observable account = null;

  @observable loaded = false;

  @observable error = null;

  @observable
  loading = {
    status: false,
    message: undefined,
  };

  @computed
  get is_loading() {
    return this.loading.status;
  }

  @computed
  get current_error() {
    return this.error;
  }

  @computed
  get current_access_token() {
    const token = AcGetAccessToken();
    if (AcIsSet(token)) return token;
    return this.access_token;
  }

  @computed
  get current_expires_in() {
    const expires_in = AcGetState(KEYS.EXPIRES_IN);
    if (AcIsSet(expires_in)) return expires_in;
    return this.expires_in;
  }

  @computed
  get current_expires_at() {
    const expires_at = AcGetState(KEYS.EXPIRES_AT);
    if (AcIsSet(expires_at)) return expires_at;
    return this.expires_at;
  }

  @computed
  get current_account() {
    return this.account;
  }

  @computed
  get current_account_id() {
    return (this.account && this.account.user_id) || null;
  }

  @computed
  get current_username() {
    return (this.account && this.account.user_name) || null;
  }

  @computed
  get current_role() {
    return (this.account && this.account.user_role) || null;
  }

  @computed
  get current_roles() {
    return (this.account && this.account.roles) || [];
  }

  @computed
  get current_name() {
    return (this.account && this.account.name) || null;
  }

  @computed
  get is_authorized() {
    let authorized = false;

    const account = this.current_account;
    const access_token = this.current_access_token;
    const expires_at = this.current_expires_at;
    const now = moment();
    let expired = true;
    let expires_in = 0;

    if (expires_at) {
      expired = expires_at && moment(expires_at, 'X').isBefore(now);
      expires_in = expires_at && moment(expires_at, 'X').fromNow();
    }

    console.group('[store] Auth => Is Authorized');
    console.log('Now:', moment(now).format('LLLL:ss'));
    console.log('Expires_at: ', moment(expires_at, 'X').format('LLLL:ss'));
    console.log('Expires in: ', expires_in);
    console.log('Is Expired: ', expired);

    authorized = account && access_token && !expired ? true : false;

    console.log('Authorized: ', authorized);
    console.groupEnd();

    return authorized === true;
  }

  @action
  setLoading = (state, message) => {
    this.loading = {
      status: state || false,
      message: message || false,
    };
  };

  @action
  clearAuthentication = () => {
    return new Promise(async (resolve) => {
      await this.set(KEYS.ACCOUNT, null);
      await this.set(KEYS.ACCESS_TOKEN, null);
      await this.set(KEYS.REFRESH_TOKEN, null);
      await this.set(KEYS.EXPIRES_IN, null);
      await this.set(KEYS.EXPIRES_AT, null);
      await this.set(KEYS.PROFILE, null);
      AcClearState();
      resolve();
    });
  };

  @action
  handleAuthentication = (result) => {
    return new Promise(async (resolve) => {
      if (result) {
        const { access_token, refresh_token, expires_in } = result;
        let account = result;

        if (access_token) await this.set(KEYS.ACCESS_TOKEN, access_token);
        if (refresh_token) await this.set(KEYS.REFRESH_TOKEN, refresh_token);

        const expires_at = moment().add(expires_in, 'seconds').format('X');

        await this.set(KEYS.EXPIRES_IN, expires_in);
        await this.set(KEYS.EXPIRES_AT, expires_at);

        if (account) await this.set(KEYS.ACCOUNT, { ...account, expires_at });
      }
      resolve();
    });
  };

  @action
  login = (credentials) => {
    if (!credentials) return;

    this.setLoading(true);

    return app.store.api.auth
      .login(credentials)
      .then(async (response) => {
        console.log('response', response);
        await this.handleAuthentication(response);

        this.setLoading(false);

        // app.store.toasters.clear_queue();

        return response;
      })
      .catch((error) => {
        this.setLoading(false);

        if (!axios.isCancel(error))
          app.store.toasters.add({
            variant: 'error',
            title: 'Failed to log in',
            description: AcFormatErrorMessage(error),
          });

        if (!axios.isCancel(error)) throw error;
      });
  };

  @action
  forgot_password = (credentials) => {
    if (!credentials) return;

    this.setLoading(true);

    return app.store.api.auth
      .forgot_password(credentials)
      .then((response) => {
        this.setLoading(false);

        return response;
      })
      .catch((error) => {
        if (!axios.isCancel(error))
          app.store.toasters.add({
            variant: 'error',
            title: 'Failed to request a recovery link',
            description: AcFormatErrorMessage(error),
          });

        this.setLoading(false);

        if (!axios.isCancel(error)) throw error;
      });
  };

  @action
  reset_password = (credentials) => {
    if (!credentials) return;

    this.setLoading(true);

    return app.store.api.auth
      .reset_password(credentials)
      .then((response) => {
        this.setLoading(false);

        return response;
      })
      .catch((error) => {
        if (!axios.isCancel(error))
          app.store.toasters.add({
            variant: 'error',
            title: 'Failed to save your new password',
            description: AcFormatErrorMessage(error),
          });

        this.setLoading(false);

        if (!axios.isCancel(error)) throw error;
      });
  };

  @action
  logout = () => {
    if (timer) clearTimeout(timer);

    return new Promise(async (resolve) => {
      await this.set(KEYS.LOADED, false);
      await this.clearAuthentication();

      // app.store.toasters.clear_queue();
      app.store.toasters.add({
        variant: 'success',
        description: 'You have successfully been logged out.',
      });

      resolve();
    });
  };

  @action
  unAuthenticate = () => {
    if (timer) clearTimeout(timer);

    const cancelRequestsEvent = new CustomEvent('cancelRequests');
    window.dispatchEvent(cancelRequestsEvent);

    return new Promise(async (resolve) => {
      await this.set(KEYS.LOADED, false);
      await this.clearAuthentication();

      // app.store.toasters.clear_queue();
      app.store.toasters.add({
        variant: 'error',
        description: 'The current session has ended. Log in again to continue.',
      });

      resolve();
    });
  };

  @action
  set = (target, value) => {
    if (!AcIsSet(target)) return;
    if (AcIsUndefined(this[target])) return;
    if (AcIsUndefined(value)) return;

    return new Promise((resolve) => {
      this[target] = value;
      AcSaveState(target, value);
      resolve();
    });
  };
}

export default AuthStore;
