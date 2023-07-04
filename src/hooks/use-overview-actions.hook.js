// Imports => Utilities
import { AcIsSet } from '@utils';
import { useMemo } from 'react';

let _searchDelay = null;

export const useOverviewActions = (store) => {
  if (!AcIsSet(store)) {
    console.warn(
      `[hook] UseOverviewActions => store is not set. Please provide a valid MobX Store instance`
    );
    return;
  }

  const handleSort = (field, get = true) => {
    // store.setOrderBy(field);
    store.setSort(field);
    if (get) store.index();
  };

  const handlePagination = (number, get = true) => {
    store.setPageNumber(number);
    if (get) store.index();
  };

  const handleSearch = (event, name, value, get = true) => {
    if (_searchDelay) clearTimeout(_searchDelay);

    store.setQuery(value);

    if (get) {
      _searchDelay = setTimeout(() => {
        store.index();
      }, 300);
    }
    {
      checkResultLength;
    }
  };
  const checkResultLength = useMemo(() => {
    const { contract_data } = store;
    const { client_data } = store;
    const { report_data } = store;
    const { contact_data } = store;

    if (contract_data && contract_data.data) {
      const resultData = contract_data.data;
      const resultLength = resultData.length;

      if (resultLength === 0) {
        store.setSearchImage();
      } else {
        store.resetSearchImage();
      }
    }

    if (client_data && client_data.data) {
      const resultData = client_data.data;
      const resultLength = resultData.length;

      if (resultLength === 0) {
        store.setSearchImage();
      } else {
        store.resetSearchImage();
      }
    }

    if (report_data && report_data.data) {
      const resultData = report_data.data;
      const resultLength = resultData.length;

      if (resultLength === 0) {
        store.setSearchImage();
      } else {
        store.resetSearchImage();
      }
    }

    if (contact_data && contact_data.data) {
      const resultData = contact_data.data;
      const resultLength = resultData.length;

      if (resultLength === 0) {
        store.setSearchImage();
      } else {
        store.resetSearchImage();
      }
    }
  });

  return {
    handleSort,
    handlePagination,
    handleSearch,
  };
};
