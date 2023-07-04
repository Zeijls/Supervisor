// Imports => Vendor
import axios from 'axios';

// Imports => API
import AuthAPI from '@api/auth.api';
import AppAPI from '@api/app.api';
import ProfileAPI from '@api/profile.api';
import ContactsAPI from '@api/contacts.api.js';
import ClientsAPI from '@api/clients.api.js';
import ContractsAPI from '@api/contracts.api.js';
import ApplicationAPI from '@api/applications.api.js';
import MediaAPI from '@api/media.api.js';
import ReportAPI from '@api/report.api.js';

const onUploadProgress = (event) => {
  // console.group('[Axios] => fn.onUploadProgress');
  // console.log('Event: ', event);
  // console.groupEnd();
};

const onDownloadProgress = (event) => {
  // console.group('[Axios] => fn.onDownloadProgress');
  // console.log('Event: ', event);
  // console.groupEnd();
};

const unauthenticatedState = (state) => {
  var unauthenticatedEvent = new CustomEvent('unAuthenticate', {
    detail: state,
  });
  window.dispatchEvent(unauthenticatedEvent);
};

let _timeOut = null;
let auth = null;

const addInterceptors = (requestClient) => {
  requestClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        clearTimeout(_timeOut);

        _timeOut = setTimeout(() => {
          auth = false;
          unauthenticatedState(auth);
        }, 500);
      }
      return Promise.reject(error);
    }
  );
};

export default (config) => {
  const Client = axios.create({
    ...config.api,
    onUploadProgress,
    onDownloadProgress,
  });
  addInterceptors(Client);

  const NoAuthClient = axios.create({
    ...config.api_no_auth,
    onUploadProgress,
    onDownloadProgress,
  });
  addInterceptors(NoAuthClient);

  const UploadClient = axios.create({
    ...config.upload,
    onUploadProgress,
    onDownloadProgress,
  });
  addInterceptors(UploadClient);

  const auth = new AuthAPI(Client, NoAuthClient, config);
  const app = new AppAPI(Client, config);
  const profile = new ProfileAPI(Client, config);
  const contacts = new ContactsAPI(Client, config);
  const clients = new ClientsAPI(Client, config);
  const contracts = new ContractsAPI(Client, config);
  const applications = new ApplicationAPI(Client, config);
  const media = new MediaAPI(Client, UploadClient, config);
  const report = new ReportAPI(Client, config);

  return {
    auth,
    app,
    profile,
    contacts,
    clients,
    contracts,
    applications,
    media,
    report,
  };
};
