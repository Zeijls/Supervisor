// Imports => Dependencies
import { makeObservable, observable, computed, action } from 'mobx';

// Imports => Constants
import { KEYS } from '@constants';

// Imports => Utilities
import {
  AcAutoLoad,
  AcAutoSave,
  AcSaveState,
  AcGetState,
  AcIsSet,
  AcFormatErrorMessage,
  AcIsUndefined,
  AcFormatRequestParameters,
} from '@utils';
import { useParams } from 'react-router';

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

export class ContractsStore {
  constructor(store) {
    makeObservable(this);

    app.store = store;
  }

  // OBSERVABLE
  @observable
  results = null;

  @observable
  searchResults = null;

  @observable
  storedContractIdObservable = null;

  @observable
  defContracttIdObservable = null;

  @observable
  addContractResults = null;

  @observable
  submitContractIdObservable = null;

  // Steps
  @observable
  currentStepObservable = 1;

  // Active state
  @observable
  tabObservable = 'contract';

  @observable
  navigationObservable = 'dashboard';

  // Pagination
  @observable
  paginationObservable = 1;

  @observable
  searchImageObservable = false;

  // COMPUTED
  @computed
  get current_contract() {
    const contractData = this.addContractResults;
    AcGetState('contracts', contractData);
    console.log('Get local storage');
    return contractData;
  }

  @computed
  get contract_data() {
    return this.results;
  }

  @computed
  get search_results() {
    return this.searchResults;
  }

  @computed
  get stored_contract_id() {
    return this.storedContractIdObservable;
  }

  @computed
  get def_contract_id() {
    return this.defContractIdObservable;
  }

  @computed
  get submit_contract_id() {
    return this.submitContractIdObservable;
  }

  // Steps
  @computed
  get current_step() {
    return this.currentStepObservable;
  }

  // State active
  @computed
  get current_tab() {
    return this.tabObservable;
  }

  @computed
  get current_link() {
    return this.navigationObservable;
  }

  // Pagination
  @computed
  get pagination_count() {
    return this.paginationObservable;
  }

  // ACTIONS
  @action
  index = (options = {}) => {
    const params = AcFormatRequestParameters(this, options);
    return app.store.api.contracts
      .index(params)
      .then((response) => {
        this.results = response;
        this.setTableData();
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

  // ACTIONS
  @action
  search = (input) => {
    return app.store.api.contracts
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
  store = (data) => {
    return app.store.api.contracts
      .store(data)
      .then((response) => {
        this.results = response;
        this.submitContractIdObservable = response.id;
        console.log('new contract:', response);
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
  storedContractId = (id) => {
    this.storedContractIdObservable = id;
    console.log(id, 'stored contract id in store (action)');
    return id;
  };

  @action
  defContractId = (id) => {
    console.log(id, 'def contract id in store');
    this.defContractIdObservable = id;
    return id;
  };

  @action
  show = (id) => {
    return app.store.api.contracts
      .show(id)
      .then((response) => {
        this.addContractResults = response.data;
        console.log('Store local storage');
        AcSaveState('contracts', response.data.id);
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
    return app.store.api.contracts
      .attach(data, id)
      .then((response) => {
        console.log('attach contract: ', response);
        this.addContractResults = response;
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
    return app.store.api.contracts
      .update(data, id)
      .then((response) => {
        console.log('update contract', response);
        this.newContractResults = response;
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
    return app.store.api.contracts
      .delete(id)
      .then((response) => {
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

  // steps
  @action
  setStepOne = () => {
    const stepOne = (this.currentStepObservable = 1);
    console.log('current step is 1', this.currentStepObservable);
    return stepOne;
  };

  @action
  setStepTwo = () => {
    const stepTwo = (this.currentStepObservable = 2);
    console.log('current step is 2', this.currentStepObservable);
    return stepTwo;
  };

  @action
  setStepThree = () => {
    const stepThree = (this.currentStepObservable = 3);
    console.log('current step is 3', this.currentStepObservable);
    return stepThree;
  };

  // State Active
  @action
  setCurrentTab = (key) => {
    this.tabObservable = key;
  };

  @action
  setCurrentLink = (key) => {
    this.navigationObservable = key;
  };

  // Pagination
  @action
  paginationPlus = () => {
    this.paginationObservable++;
  };

  @action
  paginationMinus = () => {
    this.paginationObservable--;
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
  per_page = null;

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

  @computed
  get per_page_computed() {
    return this.per_page;
  }

  @action
  setQuery = (input) => {
    // const _input = AcSanitize(input);
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
    console.log(field, 'field sorting');
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

  // Contract overview table data

  @observable
  tableDataObservable = null;

  @computed
  get table_data() {
    const tableData = this.tableDataObservable;
    return tableData;
  }

  @action
  checkFrequency = (item) => {
    const current_frequency = item.frequency;

    if (current_frequency === 1) {
      const frequency = 'Maandelijks';
      return frequency;
    }
    if (current_frequency === 2) {
      const frequency = 'Om de maand';
      return frequency;
    }
    if (current_frequency === 3) {
      const frequency = 'Elke 3 maanden';
      return frequency;
    }
    if (current_frequency === 4) {
      const frequency = 'Per kwartaal';
      return frequency;
    }
  };

  @action
  checkClientName = (item) => {
    if (item && item.client) {
      return item.client;
    } else return null;
  };

  @action
  setTableData = () => {
    const data = this.results;
    if (data && data.data) {
      let collection = data.data;

      const len = collection.length;
      let number = 0;
      let result = [];

      for (number; number < len; number++) {
        const item = collection[number];

        let rowData = {
          id: item.id,
          name: item.name,
          clientName: this.checkClientName(item),
          costs: item.costs,
          frequency: this.checkFrequency(item),
          starts_at: item.starts_at,
        };

        result.push(rowData);
      }
      this.tableDataObservable = result;
    }
  };
}

export default ContractsStore;
