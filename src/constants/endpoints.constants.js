const AUTH = '/auth';
const OAUTH = '/oauth';
const TOKEN = '/token';
const FORGOT_PASSWORD = '/forgot-password';
const LOGIN = '/login';
const LOGOUT = '/logout';
const RESET_PASSWORD = '/reset-password';
const INFO = '/info';
// const USER = '/users/who-am-i';
const SEARCH = '/search';
const QUERY = '/?q';
const PROFILE = '/profile';
const UI = '/ui';
const APPLICATIONS = '/applications';
const APPLICATION = '/:application';
const CONTRACTS = '/contracts';
const CONTRACT = '/:contract';
const CLIENTS = '/clients';
const CLIENT = '/:client';
const API = '/api/v1';
const CONTACTS = '/contacts';
const CONTACT = '/:contact';
const MEDIA = '/media';
const MEDIUM = '/:medium';
const USERS = '/users';
const USER = '/:user';
const KEY = '/:key';
const RESTORE = '/restore';
const LOG = '/logs';
const REPORT = '/reports';

// V1
export const ENDPOINTS = {
  OAUTH: {
    LOGIN: `${OAUTH}${TOKEN}`, // POST
    FORGOT_PASSWORD: `${AUTH}${FORGOT_PASSWORD}`, // POST
    RESET_PASSWORD: `${AUTH}${RESET_PASSWORD}`, // POST
    LOGOUT: `${AUTH}${LOGOUT}`, // POST
  },
  APP: {
    INFO: `${API}${INFO}`, // GETww
    USER: `${API}${USER}`, // GET
    SEARCH: `${API}${SEARCH}/${QUERY}`,
  },
  PROFILE: {
    WHOAMI: `${UI}${PROFILE}`, // GET
    UPDATE: `${UI}${PROFILE}`, // POST
  },
  APPLICATION: {
    RESTORE: `${API}${APPLICATIONS}${KEY}${RESTORE}`, // PUT
    DESTROY: (id) => `${API}${APPLICATIONS}/${id}`, // DEL
    UPDATE: (id) => `${API}${APPLICATIONS}/${id}`, // PUT
    SHOW: (id) => `${API}${APPLICATIONS}/${id}`, // GET
    STORE: `${API}${APPLICATIONS}`, // POST
    INDEX: `${API}${APPLICATIONS}`, // GET
  },
  CONTRACT: {
    INDEX: `${API}${CONTRACTS}`, // GET
    STORE: `${API}${CONTRACTS}`, // POST
    SHOW: (id) => `${API}${CONTRACTS}/${id}`, // GET
    UPDATE: (id) => `${API}${CONTRACTS}/${id}`, // PUT
    DESTROY: (id) => `${API}${CONTRACTS}/${id}`, // DEL
    RESTORE: `${API}${CONTRACTS}${KEY}${RESTORE}`, // DEL
    ATTACH: (id) => `${API}${CONTRACTS}/${id}${CONTACTS}`, // POST
    DETATCH: `${API}${CONTRACTS}${CONTRACT}${CONTACTS}`, // DEL

    MEDIA: {
      INDEX: (id) => `${API}${CONTRACTS}/${id}${MEDIA}`, // GET
      STORE: (id) => `${API}${CONTRACTS}/${id}${MEDIA}`, // POST
      SHOW: (id) => `${API}${CONTRACTS}/${id}${MEDIA}/${id}`, // GET
      UPDATE: (id) => `${API}${CONTRACTS}/${id}${MEDIA}/${id}`, // PUT
      DESTROY: (contract_id, media_id) =>
        `${API}${CONTRACTS}/${contract_id}${MEDIA}/${media_id}`, // DEL
    },
  },
  CLIENT: {
    INDEX: `${API}${CLIENTS}`, // GET
    STORE: `${API}${CLIENTS}`, // POST
    SHOW: (id) => `${API}${CLIENTS}/${id}`, // GET
    UPDATE: (id) => `${API}${CLIENTS}/${id}`, // PUT
    DESTROY: (id) => `${API}${CLIENTS}/${id}`, // DEL
    RESTORE: `${API}${CLIENTS}${KEY}${RESTORE}`, // DEL
    ATTACH: (id) => `${API}${CLIENTS}/${id}${CONTACTS}`, // POST
    DETATCH: `${API}${CLIENTS}${CLIENT}${CONTACTS}`, // DEL

    CONTACT: {
      INDEX: `${API}${CONTACTS}`, // GET
      STORE: `${API}${CONTACTS}`, // POST
      SHOW: (id) => `${API}${CONTACTS}/${id}`, // GET
      UPDATE: (id) => `${API}${CONTACTS}/${id}`, // PUT
      DESTROY: (id) => `${API}${CONTACTS}/${id}`, // DEL
      RESTORE: `${API}${CONTACTS}${KEY}${RESTORE}`, // DEL
    },
  },
  USER: {
    INDEX: `${API}${USERS}`, // GET
    STORE: `${API}${USERS}`, // POST
    SHOW: `${API}${USERS}${USER}`, // GET
    UPDATE: `${API}${USERS}${USER}`, // PUT
    DESTROY: `${API}${USERS}${USER}`, // DEL
  },

  LOG: {
    INDEX: `${API}${LOG}`, // GET
    STORE: `${API}${LOG}`, // POST
    SHOW: (id) => `${API}${LOG}/${id}`, // GET
    UPDATE: (id) => `${API}${LOG}/${id}`, // PUT
    DESTROY: (id) => `${API}${LOG}/${id}`, // DEL
    RESTORE: (id) => `${API}${LOG}/${id}${RESTORE}`, // PUT

    REPORT: {
      INDEX: `${API}${REPORT}`, // GET
      STORE: `${API}${REPORT}`, // POST
      SHOW: (id) => `${API}${REPORT}/${id}`, // GET
      UPDATE: (id) => `${API}${REPORT}/${id}`, // PUT
      DESTROY: (id) => `${API}${REPORT}/${id}`, // DEL
      RESTORE: (id) => `${API}${REPORT}/${id}${RESTORE}`, // PUT
    },
  },
};

export default ENDPOINTS;
