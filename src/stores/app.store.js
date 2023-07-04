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

export class AppStore {
  constructor(store) {
    makeObservable(this);

    app.store = store;
  }

  // ACTION
  @action
  search = (input) => {
    return app.store.api.app
      .search(input)
      .then((response) => {
        this.results = response;
        return response;
      })
      .catch((error) => {
        app.store.toasters.add({
          description: AcFormatErrorMessage(error),
          //   code: AcFormatErrorCode(error),
        });

        throw error;
      });
  };
}

export default AppStore;
