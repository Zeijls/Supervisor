// Imports => MOBX
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

export class MediaStore {
  constructor(store) {
    makeObservable(this);

    app.store = store;
  }

  // OBSERVABLE
  @observable
  results = null;

  @observable
  storedMediaObservable = null;

  // COMPUTED
  @computed
  get stored_media() {
    return this.storedMediaObservable;
  }

  // ACTIONS
  @action
  index = () => {
    return app.store.api.media
      .index()
      .then((response) => {
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
  store = (data, id) => {
    return app.store.api.media
      .store(data, id)
      .then((response) => {
        this.storedMediaObservable = response;
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
    return app.store.api.media
      .show(id)
      .then((response) => {
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
  attach = (data, id) => {
    return app.store.api.media
      .attach(data, id)
      .then((response) => {
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
  update = (data, id) => {
    return app.store.api.media
      .update(data, id)
      .then((response) => {
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
  delete = (contract_id, media_id) => {
    return app.store.api.media
      .delete(contract_id, media_id)
      .then((response) => {
        this.index();
        console.log('item deleted', response);
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
}

export default MediaStore;
