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
  storedReportIdObservable = null;

  @observable
  addReportResults = null;

  // Pagination
  @observable
  paginationObservable = 1;

  @observable
  searchImageObservable = false;

  // COMPUTED
  @computed
  get current_report() {
    const reportData = this.addReportResults;
    return reportData;
  }

  @computed
  get report_data() {
    return this.results;
  }

  @computed
  get search_results() {
    return this.searchResults;
  }

  @computed
  get stored_report_id() {
    return this.storedReportIdObservable;
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
    return app.store.api.report
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
    return app.store.api.report
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
    return app.store.api.report
      .store(data)
      .then((response) => {
        this.results = response;
        this.submitReportIdObservable = response.id;
        console.log('new report:', response);
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
    return app.store.api.report
      .show(id)
      .then((response) => {
        this.addReportResults = response.data;
        console.log('Store local storage');
        AcSaveState('report', response.data.id);
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
    return app.store.api.report
      .attach(data, id)
      .then((response) => {
        console.log('attach report: ', response);
        this.addReportResults = response;
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
    return app.store.api.report
      .update(data, id)
      .then((response) => {
        console.log('update report', response);
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
    return app.store.api.report
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
    if (this.per_page !== num) this.per_page = 5;
  };

  @action
  setSort = (field, direction) => {
    let sort = this.sort;
    if (direction) {
      sort.direction === direction;
    } else if (sort.field === field) {
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

  // Logs report detail
  @observable
  jiraLogs = [];

  @observable
  otherLogs = [];

  @computed
  get jira_logs() {
    return this.jiraLogs;
  }

  @computed
  get other_logs() {
    return this.otherLogs;
  }

  @action
  setJiraLog = (log) => {
    this.jiraLogs.push(log);
  };

  @action
  setOtherLog = (log) => {
    this.otherLogs.push(log);
  };

  // Report overview table data
  @observable
  tableDataObservable = null;

  @computed
  get table_data() {
    const tableData = this.tableDataObservable;
    console.log('tableData', tableData);
    return tableData;
  }

  @action
  setTableData = () => {
    const data = this.results;
    console.log(data, 'data');
    if (data) {
      let collection = data.data;

      const len = collection.length;
      let number = 0;
      let result = [];

      for (number; number < len; number++) {
        const item = collection[number];

        let rowData = {
          id: item.id,
          contractName: null,
          created_at: item.created_at,
          from_date: item.from_date,
          to_date: item.to_date,
          updated_at: item.updated_at,
        };

        result.push(rowData);
      }
      this.tableDataObservable = result;
    }
  };
}

export default ContractsStore;
