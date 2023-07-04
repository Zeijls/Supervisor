// Imports => MOBX
import { makeObservable, observable, computed, action, toJS, set } from 'mobx';

// Imports => Constants
import { KEYS, TITLES } from '@constants';

// Imports => Utilities
import { AcUUID, AcIsSet, AcIsUndefined } from '@utils';

const _default = {
  modal: {
    id: AcUUID(),
    visible: false,
    title: '',
    body: [],
    actions: [],
    closeable: true,
    callback: () => {},
  },
  navigation: {
    visible: false,
    expanded: [],
  },
  contextual_menu: {
    visible: false,
    id: null,
  },
  table_contextual_menu: {
    visible: false,
    id: null,
  },
  breadcrumbs: {
    items: [],
  },
};

let _delay = null;
let _target = null;

export class UiStore {
  constructor(store) {
    makeObservable(this);

    this.store = store;
  }

  @observable
  navigation = _default.navigation;

  @observable
  contextual_menu = _default.contextual_menu;

  @observable
  table_contextual_menu = _default.table_contextual_menu;

  @observable
  breadcrumbs = _default.breadcrumbs;

  @observable
  modal = _default.modal;

  @computed
  get current_modal() {
    return this.modal;
  }

  @computed
  get current_navigation() {
    return this.navigation;
  }

  @computed
  get current_contextual_menu() {
    return this.contextual_menu;
  }

  @computed
  get current_table_contextual_menu() {
    return this.table_contextual_menu;
  }

  @computed
  get current_breadcrumbs() {
    return this.breadcrumbs && this.breadcrumbs.items;
  }

  @action
  multi_select = async (options = {}) => {
    await this.reset(KEYS.MODAL);
    return await this.set(KEYS.MODAL, {
      title: TITLES.MULTI_SELECT,
      tag: KEYS.MULTI_SELECT,
      props: options,
      closeable: true,
      visible: true,
      ...options,
    });
  };

  @action
  confirm = async (options = {}) => {
    await this.reset(KEYS.MODAL);
    return await this.set(KEYS.MODAL, {
      title: TITLES.DELETE_CONFIRM,
      tag: KEYS.CONFIRM,
      props: options,
      closeable: false,
      visible: true,
      centered: true,
      ...options,
    });
  };

  @action
  setInstance = (target, value, initial = true) => {
    return new Promise((resolve) => {
      if (!AcIsSet(target)) return;
      if (AcIsUndefined(this[target])) return;
      if (AcIsUndefined(value)) return;

      set(this[target], value);

      console.log('set', this[target]);

      resolve();
    });
  };

  @action
  setValue = (target, property, value) => {
    return new Promise((resolve, reject) => {
      if (_delay && _target === target) clearTimeout(_delay);

      if (!AcIsSet(target)) {
        reject(`[store][ui] action.setValue: 'target' is not defined`);
        return;
      } else if (!AcIsSet(property)) {
        reject(`[store][ui] action.setValue: 'property' is not defined`);
        return;
      } else if (AcIsUndefined(this[target])) {
        reject(
          `[store][ui] action.setValue: target '${target}' is not an ui element`
        );
        return;
      } else if (AcIsUndefined(this[target][property])) {
        reject(
          `[store][ui] action.setValue: property '${property}' is not part of target ${target}`
        );
        return;
      } else if (AcIsUndefined(value)) {
        reject(`[store][ui] action.setValue: value is not defined`);
        return;
      }

      const initial = this[target];
      initial[property] = value;

      set(this[target], initial);

      resolve();
    });
  };

  @action
  reset = (target) => {
    return new Promise((resolve, reject) => {
      if (AcIsUndefined(target)) return;
      if (AcIsUndefined(this[target])) return;

      set(this[target], _default[target]);

      resolve();
    });
  };
}

export default UiStore;
