// Imports => React
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { toJS } from 'mobx';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, ICONS } from '@constants';

// Imports => Molecules
import AcContractsRender from '@molecules/ac-contracts-render/ac-contracts-render';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
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

const AcContractsSorting = ({ contract_data, store }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const [input, setInput] = useState('');
  const [searchListDefault, setSearchListDefault] = useState([]);
  const [searchList, setSearchList] = useState('');
  const { search_results } = store.contracts;
  let _searchDelay = null;

  const getSortingClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTRACTS.SORT);
  }, []);

  const getButtonsBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTRACTS.BUTTONSBLOCK);
  }, []);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const redirectNewContract = () => {
    const newContract = ROUTES.NEWCONTRACT.path;
    history.push(newContract);
  };

  const getAddButtonOptions = useMemo(() => {
    return {
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Nieuw Contract',
      callback: redirectNewContract,
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

  // Via api en store
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

  // Optie zonder api call
  // const updateInput = async (input) => {
  //   console.log(input, 'input');

  //   const filtered = searchListDefault.filter((searchItem) => {
  //     return searchItem.name.toLowerCase().includes(input.toLowerCase());
  //   });

  //   setInput(input);
  //   setSearchList(filtered);
  //   console.log('update input field');
  //   console.log('searchlist', searchList);
  // };

  useEffect(() => {
    getData();
  }, [contract_data]);

  const renderContractsFilter = useMemo(() => {
    return (
      <div className={getMainClassNames}>
        <div className={getSortingClassNames}>
          <AcSearchBar input={input} onChange={updateInput} />
          <div className={getButtonsBlockClassNames}>
            <AcButton {...getAddButtonOptions}>
              <span>
                <AcIcon icon={ICONS.ADD} />
                Nieuw contract
              </span>
            </AcButton>
          </div>
        </div>

        <AcContractsRender
          searchList={searchList}
          contract_data={contract_data}
        />
      </div>
    );
  });

  return <div> {renderContractsFilter}</div>;
};

export default withStore(observer(AcContractsSorting));
