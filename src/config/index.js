// Imports => Constants
import { KEYS } from '@constants';

// Imports => Utilities
import { AcRequestTransformer } from '@utils';

// Get ENV variables
const ENV = process.env;
const _api_ = ENV.API_URL;
const _mode_ = ENV.MODE;
const _public_url_ = ENV.PUBLIC_URL;
const _locale_ = ENV.LOCALE || 'nl-NL';
const _gtm_key_ = ENV.GTM_KEY;
const _app_url_ = ENV.APP_URL;

const _email_ = ENV.EMAIL;
const _password_ = ENV.PASSWORD;

const _auto_logout = ENV.AUTO_LOGOUT;
const _auto_logout_time = ENV.AUTO_LOGOUT_TIME;

(function () {
  if (typeof window.CustomEvent === 'function') return false; //If not IE

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

export default {
  mode: _mode_,
  public_url: _public_url_,
  locale: _locale_,
  email: _email_,
  password: _password_,
  gtmId: _gtm_key_,
  appUrl: _app_url_,
  noSessionEvent: new CustomEvent(KEYS.NO_SESSION),
  autologout: {
    active: _auto_logout || false,
    time: _auto_logout_time || 0,
  },
  rollbar: {
    accessToken: ENV.ROLLBAR_KEY,
    captureUncaught: true,
    captureUnhandledRejections: true,
    verbose: false,
    payload: {
      environment: ENV.ROLLBAR_ENVIRONMENT,
    },
  },
  api: {
    baseURL: `${_api_}`,
    timeout: 1000 * 60,
    maxContentLength: 10000,
    responseType: 'json',
    responseEncoding: 'utf8',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    transformRequest: [AcRequestTransformer],
  },
  api_no_auth: {
    baseURL: `${_api_}`,
    timeout: 1000 * 60,
    maxContentLength: 10000,
    responseType: 'json',
    responseEncoding: 'utf8',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
  download: {
    baseURL: `${_api_}`,
    timeout: 1000 * 60,
    maxContentLength: 10000,
    responseType: 'blob',
    responseEncoding: 'utf8',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/pdf',
    },
  },
  upload: {
    baseURL: _api_,
    timeout: 1000 * 60,
    maxContentLength: 10000,
    responseType: 'json',
    responseEncoding: 'utf8',
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
      type: 'formData',
    },
    transformRequest: [
      (data, headers) => AcRequestTransformer(data, headers, false),
    ],
  },
};
