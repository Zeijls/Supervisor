// Imports => React
import React, { useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES } from '@constants';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  CLIENTS: {
    LIST: 'ac-render-overview__list',
    HEADER: 'ac-render-overview__header',
    LINK: 'ac-render-overview__link',
    LISTITEM: 'ac-render-overview__list-item',
    PARAGRAPH: 'ac-render-overview__paragraph',
  },
};

const AcContractsRender = ({ searchList, contract_data }) => {
  const history = useHistory();

  const getListClassNames = useMemo(() => {
    return clsx(_CLASSES.CLIENTS.LIST);
  }, []);

  const getHeaderListClassNames = useMemo(() => {
    return clsx(_CLASSES.CLIENTS.HEADER);
  }, []);

  const getLinkClassNames = useMemo(() => {
    return clsx(_CLASSES.CLIENTS.LINK);
  }, []);

  const getListItemClassNames = useMemo(() => {
    return clsx(_CLASSES.CLIENTS.LISTITEM);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.CLIENTS.PARAGRAPH);
  }, []);

  const storeItem = (id) => {
    const contractId = ROUTES.CONTRACTDETAIL.path.replace(':id?', id);
    history.push(contractId);
  };

  const renderContracts = useMemo(() => {
    if (!contract_data || !contract_data.data) return null;

    let collection = searchList;

    if (!searchList) {
      collection = contract_data.data;
    }

    const len = collection.length;
    let n = 0;
    let result = [];

    for (n; n < len; n++) {
      const item = collection[n];

      const object = (
        <AcButton
          className={getLinkClassNames}
          key={`ac-contract-${n}`}
          onClick={(event) => {
            event.preventDefault();
            storeItem(item.id);
          }}
        >
          <li className={getListItemClassNames}>
            <p className={getParagraphClassNames}>{item.id}</p>
            <p className={getParagraphClassNames}>{item.name}</p>
            <p className={getParagraphClassNames}>{item.costs}</p>
            <p className={getParagraphClassNames}>{item.hours}</p>
            <p className={getParagraphClassNames}>{item.starts_at}</p>
            <p className={getParagraphClassNames}>{item.ends_at}</p>
          </li>
        </AcButton>
      );

      result.push(object);
    }

    return result;
  }, [searchList, contract_data]);

  const renderAllContracts = useMemo(() => {
    return (
      <section>
        <ul className={getListClassNames}>
          <li className={getHeaderListClassNames}>
            <p className={getParagraphClassNames}>ID</p>
            <p className={getParagraphClassNames}>Contract</p>
            <p className={getParagraphClassNames}>Kosten</p>
            <p className={getParagraphClassNames}>Uren</p>
            <p className={getParagraphClassNames}>Startdatum</p>
            <p className={getParagraphClassNames}>Einddatum</p>
          </li>
          {renderContracts}
        </ul>
      </section>
    );
  });

  return <div> {renderAllContracts}</div>;
};

export default withRouter(withStore(observer(AcContractsRender)));
