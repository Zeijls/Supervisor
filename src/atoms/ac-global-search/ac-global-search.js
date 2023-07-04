// Imports => React
import React, { useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  CONTRACTS: {
    SORT: 'ac-sorting__sort',
    SEARCHFIELD: 'ac-sorting__searchfield',
    INPUTFIELD: 'ac-sorting__inputfield',
    BUTTONSBLOCK: 'ac-sorting__buttonsblock',
  },
};

const AcGlobalSearch = ({ onChange }) => {
  const [keyword, setKeyword] = useState('');
  const getSearchFieldClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTRACTS.SEARCHFIELD);
  }, []);

  const getInputFieldClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTRACTS.INPUTFIELD);
  }, []);

  const getInputOptions = useMemo((event) => {
    return {
      required: false,
      type: 'text',
    };
  });

  const renderSearchBar = useMemo(() => {
    return (
      <input
        placeholder="Zoek op trefwoord."
        {...getInputOptions}
        className={getInputFieldClassNames}
        value={keyword}
        onChange={(event) => {
          onChange(event.target.value);
          setKeyword(event.target.value);
        }}
      />
    );
  });

  return <div className={getSearchFieldClassNames}>{renderSearchBar}</div>;
};

export default withRouter(withStore(observer(AcGlobalSearch)));
