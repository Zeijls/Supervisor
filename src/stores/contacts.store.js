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

export class ContactStore {
  constructor(store) {
    makeObservable(this);

    app.store = store;
  }

  // OBSERVABLE
  @observable
  results = null;

  @observable
  addContactResults = null;

  @observable
  chosenContactObservable = null;

  @observable
  newContactObservable = null;

  // COMPUTED
  @computed
  get contact_data() {
    return this.results;
  }

  @computed
  get current_contact() {
    return this.addContactResults;
  }

  @computed
  get chosen_contact_id() {
    console.log(this.chosenContactObservable, 'computed value');
    return this.chosenContactObservable;
  }

  @computed
  get new_contact_id() {
    return this.newContactObservable;
  }

  @computed
  get chosen_contact_id() {
    return this.chosenClientObservable;
  }

  // ACTIONS
  @action
  index = () => {
    return app.store.api.contacts
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
  chosenContactId = (id) => {
    this.chosenContactObservable = id;
    console.log(id, 'action id value');
    return id;
  };

  @action
  store = (data) => {
    console.log('new contact');
    return app.store.api.contacts
      .store(data)
      .then((response) => {
        console.log('new contact: ', response);
        this.newContactObservable = response.id;
        return response;
      })
      .catch((error) => {
        app.store.toasters.add({
          title: 'Nieuw contact aanmaken is niet gelukt',
          description: AcFormatErrorMessage(error),
          code: AcFormatErrorCode(code),
        });

        throw error;
      });
  };

  @action
  show = (id) => {
    return app.store.api.contacts
      .show(id)
      .then((response) => {
        this.addContactResults = response.data;
        console.log(response.data, 'show data');
        console.log('item refreshed', response);
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
    return app.store.api.contacts
      .attach(data, id)
      .then((response) => {
        console.log('add contact: ', response);
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
    return app.store.api.contacts
      .update(data, id)
      .then((response) => {
        console.log('update item', response);
        this.formData = response;
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
    return app.store.api.contacts
      .delete(id)
      .then((response) => {
        this.index();
        console.log('item deleted');
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
  setTableData = (data) => {
    console.log(data, 'table datadata');
    if (data) {
      let collection = data;
      console.log(collection, 'collection ');

      const len = collection.length;
      let number = 0;
      let result = [];

      for (number; number < len; number++) {
        const item = collection[number];
        console.log(item, 'item');

        let rowData = {
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          function: item.function,
          company: item.company,
          button: 'wijzigen',
        };

        result.push(rowData);
      }
      this.tableDataObservable = result;
    }
  };
}

export default ContactStore;
