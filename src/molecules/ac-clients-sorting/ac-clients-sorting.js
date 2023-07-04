// Imports => React
import React, { useMemo, useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, ICONS } from '@constants';

// Imports => Molecules
import AcClientsRender from '@molecules/ac-clients-render/ac-clients-render.js';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button';
import AcSearchBar from '@atoms/ac-search-bar/ac-search-bar';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',

  CONTRACTS: {
    SORT: 'ac-sorting__sort',
    SEARCHFIELD: 'ac-sorting__searchfield',
    INPUTFIELD: 'ac-sorting__inputfield',
    BUTTONSBLOCK: 'ac-sorting__buttonsblock',
  },
};

const AcClientsSorting = ({ client_data, contract_data, store }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const [input, setInput] = useState('');
  const [searchListDefault, setSearchListDefault] = useState([]);
  const [searchList, setSearchList] = useState('');
  const { search_results } = store.contracts;
  let _searchDelay = null;

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const getSortingClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTRACTS.SORT);
  }, []);

  const getButtonsBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTRACTS.BUTTONSBLOCK);
  }, []);

  const redirectNewClient = () => {
    const newContract = ROUTES.NEWCLIENT.path;
    history.push(newContract);
  };

  const getAddButtonOptions = useMemo(() => {
    return {
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Nieuw Contract',
      callback: redirectNewClient,
    };
  }, []);

  const getData = () => {
    if (!contract_data) return null;
    console.log(contract_data);
    const { data } = contract_data;
    setSearchList(data);
    setSearchListDefault(data);
  };

  const newSearchList = (collection, input) => {
    setSearchList(collection);
  };

  const updateInput = (value) => {
    // setInput(value);
    if (_searchDelay) clearTimeout(_searchDelay);
    _searchDelay = setTimeout(() => {
      store.contracts.search(value);

      if (search_results && search_results.data) {
        let collection = search_results.data;
        console.log(searchList, 'search list');
        newSearchList(collection, value);
      }
    }, 300);
  };

  const renderClients = useMemo(() => {
    return (
      <div className={getMainClassNames}>
        <div className={getSortingClassNames}>
          <AcSearchBar input={input} onChange={updateInput} />
          <div className={getButtonsBlockClassNames}>
            <AcButton {...getAddButtonOptions}>
              <span>
                <AcIcon icon={ICONS.ADD} />
                Nieuwe klant
              </span>
            </AcButton>
          </div>
        </div>

        <AcClientsRender
          searchList={searchList}
          client_data={client_data}
          contract_data={contract_data}
        />
      </div>
    );
  });

  return <div>{renderClients} </div>;
};

export default withRouter(withStore(observer(AcClientsSorting)));
