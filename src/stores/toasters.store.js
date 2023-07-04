// Imports => Dependencies
import { makeObservable, observable, computed, action, toJS } from 'mobx';

// Imports => Constants
import { KEYS } from '@constants';

// Imports => Utilities
import { AcUUID, AcIsSet, AcIsUndefined, AcSaveState } from '@utils';

let app = {};

export class ToastersStore {
  constructor(store) {
    makeObservable(this);

    app.store = store;
  }

  @observable
  collection = [];

  @computed
  get queue() {
    return this.collection;
  }

  @action
  add = (options) => {
    return new Promise((resolve) => {
      /*
      options: {
        variant: <string>,
        title: <string>,
        description: <string>,
        delay: <int>,
      }
    */

      const time = new Date().getTime();
      const delay = options.delay ? options.delay : 1000 * 8;
      const expires = time + delay;

      const toast = {
        ...options,
        id: AcUUID(),
        delay,
        time,
        expires,
      };

      this.clear_queue();

      const collection = this.queue !== null ? this.queue : [];
      collection.push(toast);
      this.collection = collection;

      resolve(toast);
      return toast;
    });
  };

  @action
  update = (id, options) => {
    const collection = this.queue.slice();
    const len = collection.length;
    let n = 0;
    let result = collection;
    let found = null;
    let index = null;

    for (n; n < len; n++) {
      const item = collection[n];

      if (item.id === id) {
        found = item;
        index = n;
        break;
      }
    }

    if (found) {
      const time = new Date().getTime();
      const delay = options.delay ? options.delay : 1000 * 8;
      const expires = time + delay;

      found = {
        ...found,
        ...options,
        delay,
        time,
        expires,
      };

      collection[index] = found;
      this.collection = collection;
    }
  };

  @action
  clear_queue = () => {
    this.collection = [];
  };

  @action
  remove = (id) => {
    const collection = this.queue !== null ? this.queue : [];
    let new_collection = null;

    if (!AcIsSet(id)) {
      new_collection = collection.shift();
    } else {
      new_collection = collection.filter((item) => item.id !== id);
    }

    this.set(KEYS.COLLECTION, new_collection);
  };

  @action
  set = (target, value) => {
    if (!AcIsSet(target)) return;
    if (AcIsUndefined(this[target])) return;
    if (AcIsUndefined(value)) return;

    return new Promise((resolve) => {
      this[target] = value;
      resolve();
    });
  };
}

export default ToastersStore;
