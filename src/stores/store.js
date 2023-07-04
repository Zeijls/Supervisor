// Imports => Dependencies
import React, { createContext } from 'react';
import { makeObservable, observable, action } from 'mobx';

// Imports => API
import createApi from '@api';

// Imports => Stores
import AuthStore from '@stores/auth.store';
import AppStore from '@stores/app.store';
import ProfileStore from '@stores/profile.store';
import ToastersStore from '@stores/toasters.store';
import UiStore from '@stores/ui.store';
import ContactStore from '@stores/contacts.store';
import ClientStore from '@stores/clients.store';
import ContractsStore from '@stores/contracts.store';
import ApplicationStore from '@stores/applications.store';
import ReportStore from '@stores/report.store';
// import DragAndDropStore from '@stores/drag-and-drop.store';
import MediaStore from '@stores/media.store';

class Store {
  constructor(config) {
    makeObservable(this);

    this.config = config;

    this.api = createApi(config);

    this.auth = new AuthStore(this);
    this.app = new AppStore(this);
    this.profile = new ProfileStore(this);
    this.toasters = new ToastersStore(this);
    this.ui = new UiStore(this);
    this.contacts = new ContactStore(this);
    this.clients = new ClientStore(this);
    this.contracts = new ContractsStore(this);
    this.applications = new ApplicationStore(this);
    // this.draganddrop = new DragAndDropStore(this);
    this.media = new MediaStore(this);
    this.report = new ReportStore(this);
  }

  @observable
  Updated = false;
}

export default Store;
