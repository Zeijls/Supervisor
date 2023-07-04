// Imports => Dependencies
import { makeObservable, observable, computed, action } from 'mobx';

// Imports => Constants
import { KEYS } from '@constants';

// Imports => Utilities
import {
  AcAutoLoad,
  AcAutoSave,
  AcSaveState,
  AcIsSet,
  AcFormatErrorMessage,
  AcIsUndefined,
} from '@utils';

const _default = {
  options: {},
  profile: {
    id: '',
    name: '',
    email: '',
    usps: {},
  },
  error: null,
};

let app = {};

export class ApplicationStore {
  constructor(store) {
    makeObservable(this);

    app.store = store;
  }

  // OBSERVABLE
  @observable
  results = null;

  @observable
  addApplicationResults = null;

  @observable
  showApplicationsObservable = null;

  // COMPUTED
  @computed
  get current_application() {
    return this.showApplicationsObservable;
  }

  @computed
  get currentApplication() {
    return this.addApplicationResults;
  }

  @computed
  get applicationData() {
    return this.results;
  }

  // ACTION
  @action
  index = () => {
    return app.store.api.applications
      .index()
      .then((response) => {
        this.results = response;
        return response;
      })
      .catch((error) => {
        app.store.toasters.add({
          description: AcFormatErrorMessage(error),
          code: AcFormatErrorCode(error),
        });

        throw error;
      });
  };

  @action
  store = (data) => {
    return app.store.api.applications
      .store(data)
      .then((response) => {
        console.log('new application: ', response);
        this.storeApplicationObservable = response;
        return response;
      })
      .catch((error) => {
        app.store.toasters.add({
          description: AcFormatErrorMessage(error),
          code: AcFormatErrorCode(error),
        });

        throw error;
      });
  };

  @action
  show = (id) => {
    return app.store.api.applications
      .show(id)
      .then((response) => {
        this.showApplicationsObservable = response.data;
        return response;
      })
      .catch((error) => {
        app.store.toasters.add({
          description: AcFormatErrorMessage(error),
          // code: AcFormatErrorCode(error),
        });

        throw error;
      });
  };

  @action
  attach = (data, id) => {
    return app.store.api.applications
      .attach(data, id)
      .then((response) => {
        console.log('add client: ', response);
        this.addApplicationResults = response;
        return response;
      })
      .catch((error) => {
        app.store.toasters.add({
          description: AcFormatErrorMessage(error),
          // code: AcFormatErrorCode(error),
        });

        throw error;
      });
  };

  @action
  update = (data, id) => {
    return app.store.api.applications
      .update(data, id)
      .then((response) => {
        console.log('update item', response);
        return response;
      })
      .catch((error) => {
        app.store.toasters.add({
          description: AcFormatErrorMessage(error),
          // code: AcFormatErrorCode(error),
        });
        throw error;
      });
  };

  @action
  delete = (id) => {
    return app.store.api.applications
      .delete(id)
      .then((response) => {
        this.index();
        console.log('item deleted', response);
        return response;
      })
      .catch((error) => {
        app.store.toasters.add({
          description: AcFormatErrorMessage(error),
          code: AcFormatErrorCode(error),
        });
        throw error;
      });
  };
}

export default ApplicationStore;
