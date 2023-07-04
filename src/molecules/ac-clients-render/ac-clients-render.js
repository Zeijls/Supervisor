// Imports => React
import React, { useEffect, useMemo } from 'react';
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
  OVERVIEW: {
    LIST: 'ac-render-overview__list',
    HEADER: 'ac-render-overview__header',
    LINK: 'ac-render-overview__link',
    LISTITEM: 'ac-render-overview__list-item',
    PARAGRAPH: 'ac-render-overview__paragraph',
  },
};

const AcClientsRender = ({ client_data, contract_data, searchList }) => {
  console.log(contract_data, 'contract data render');
  const history = useHistory();

  const getListClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.LIST);
  }, []);

  const getHeaderListClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.HEADER);
  }, []);

  const getLinkClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.LINK);
  }, []);

  const getListItemClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.LISTITEM);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.PARAGRAPH);
  }, []);

  const storeItem = (id) => {
    const contractId = ROUTES.CLIENTDETAIL.path.replace(':id?', id);
    history.push(contractId);
  };

  const checkClientObject = (id) => {
    console.log('hi dit is het contract id', id);
  };

  const renderClients = useMemo(() => {
    console.log('hier kom ik nog');
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
      const id = item.id;

      checkClientObject(id);

      const object = (
        <AcButton
          className={getLinkClassNames}
          key={`ac-client-${n}`}
          onClick={(event) => {
            event.preventDefault();
            storeItem(item.id);
          }}
        >
          <li className={getListItemClassNames}>
            <p className={getParagraphClassNames}>hoi</p>
            {/* <p className={getParagraphClassNames}>{item.name}</p>
            <p className={getParagraphClassNames}>{item.email}</p>
            <p className={getParagraphClassNames}>{item.city}</p>
            <p className={getParagraphClassNames}>{item.chamber_of_commerce}</p> */}
          </li>
        </AcButton>
      );

      result.push(object);
    }

    return result;
  }, [searchList, contract_data]);

  const renderAllClients = useMemo(() => {
    return (
      <section>
        <ul className={getListClassNames}>
          <li className={getHeaderListClassNames}>
            <p className={getParagraphClassNames}>ID</p>
            <p className={getParagraphClassNames}>Naam</p>
            <p className={getParagraphClassNames}>Email</p>
            <p className={getParagraphClassNames}>Stad</p>
            <p className={getParagraphClassNames}>Chamber of Commerce</p>
          </li>
          {renderClients}
        </ul>
      </section>
    );
  });

  return <div>{renderAllClients} </div>;
};

export default withRouter(withStore(observer(AcClientsRender)));
