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
  AcFormatErrorCode,
  AcIsUndefined,
  AcFormatRequestParameters,
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

export class ClientStore {
  constructor(store) {
    makeObservable(this);

    app.store = store;
  }

  // OBSERVABLE
  @observable results = null;

  @observable searchResults = null;

  @observable newClientIdObservable = null;

  @observable updatedClientIdObservable = null;

  @observable defClientIdObservable = null;

  @observable storeClientObservable = null;

  @observable showClientResults = null;

  @observable chosenClientObservable = null;

  @observable chosenClientNameObservable = null;

  @observable
  formSteps = [
    { id: 1, name: 'step 1', active: true },

    {
      id: 2,
      name: 'step 2',
      active: false,
    },
  ];

  // Pagination
  @observable
  paginationObservable = 1;

  @observable
  searchImageObservable = false;

  // COMPUTED
  @computed
  get current_client() {
    return this.showClientResults;
  }

  @computed
  get search_results() {
    return this.searchResults;
  }

  @computed
  get stored_client_data() {
    return this.storedClientIdObservable;
  }

  @computed
  get client_data() {
    return this.results;
  }

  // Check wich client id is used
  @computed
  get new_client_id() {
    return this.newClientIdObservable;
  }

  @computed
  get updated_client_id() {
    return this.updatedClientIdObservable;
  }

  @computed
  get chosen_client_id() {
    return this.chosenClientObservable;
  }

  @computed
  get chosen_client_name() {
    return this.chosenClientNameObservable;
  }

  // ACTION
  @action
  index = (options = {}) => {
    const params = AcFormatRequestParameters(this, options);
    return app.store.api.clients
      .index(params)
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
  search = (input) => {
    return app.store.api.clients
      .search(input)
      .then((response) => {
        this.searchResults = response;
        console.log(response, 'search response');
        return response;
      })
      .catch((error) => {
        app.store.toasters.add({
          description: AcFormatErrorMessage(error),
          if(AcFormatErrorCode) {
            code: AcFormatErrorCode(error);
          },
        });
        throw error;
      });
  };

  @action
  chosenClientId = (id) => {
    this.chosenClientObservable = id;
    return id;
  };

  // @action
  // chosenClientName = (name) => {
  //   const clientName = name;
  //   this.chosenClientNameObservable = clientName;
  //   return clientName;
  // };

  @action
  store = (data) => {
    return app.store.api.clients
      .store(data)
      .then((response) => {
        this.show();
        console.log('new client: ', response);
        this.storeClientObservable = response;
        this.newClientIdObservable = response.id;
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
    return app.store.api.clients
      .show(id)
      .then((response) => {
        this.showClientResults = response.data;
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
    return app.store.api.clients
      .attach(data, id)
      .then((response) => {
        console.log('add client: ', response);
        this.showClientResults = response;
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
    return app.store.api.clients
      .update(data, id)
      .then((response) => {
        this.show();
        this.index();
        console.log('update client: ', response);
        this.newClientResults = response;
        this.updatedClientIdObservable = response.id;
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
  delete = (id) => {
    return app.store.api.clients
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

  // Le Table
  @observable
  sort = {
    field: null,
    direction: KEYS.ASCENDING,
  };

  @observable
  page = 1;

  @observable
  query = null;

  @computed
  get query_length() {
    return this.query;
  }

  @computed
  get search_image() {
    return this.searchImageObservable;
  }

  @action
  setQuery = (input) => {
    if (this.query !== input) this.query = input;
  };

  @computed
  get current_sort() {
    return this.sort;
  }

  @action
  setPageNumber = (num) => {
    if (this.page !== num) this.page = num;
  };

  @action
  setPerPage = (num) => {
    if (this.per_page !== num) this.per_page = num;
  };

  @action
  setSort = (field) => {
    let sort = this.sort;

    if (sort.field === field) {
      sort.direction =
        sort.direction === KEYS.ASCENDING ? KEYS.DESCENDING : KEYS.ASCENDING;
    } else sort.direction = KEYS.ASCENDING;

    sort.field = field;

    this.sort = sort;
    this.setPageNumber(1);
  };

  @action
  resetParams = () => {
    this.page = 1;
    this.query = null;
    this.per_page = 0;
    this.sort = { field: null, direction: KEYS.ASCENDING };
  };

  @action
  setSearchImage = () => {
    this.searchImageObservable = true;
  };

  resetSearchImage = () => {
    this.searchImageObservable = false;
  };
}
export default ClientStore;
