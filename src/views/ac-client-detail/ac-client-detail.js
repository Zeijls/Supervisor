// Imports => React
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES } from '@constants';

// Imports => Atoms
import AcPageTitle from '@atoms/ac-page-title/ac-page-title';
import AcContactTable from '@atoms/ac-contact-table/ac-contact-table';
import AcCardClientDetail from '@atoms/ac-card/ac-card-client-detail';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  CONTRACTDETAIL: 'ac-contract-detail',
  ICON: 'ac-action-location__icon',
  CLIENTCARD: {
    DETAIL: 'ac-client-card__detail',
  },
  HEADERS: {
    CLIENT: {
      TITLE: 'ac-headers__client-title',
    },
  },
};

const AcContractDetail = ({ store, match }) => {
  const history = useHistory();
  const { id } = match.params;
  const { current_client } = store.clients;
  const { is_loading } = store.auth;

  useEffect(() => {
    store.clients.show(id);
  }, [id]);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const getClientDetailClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTRACTDETAIL);
  }, []);

  const getClientTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.HEADERS.CLIENT.TITLE);
  }, []);

  const renderPageTitle = useMemo(() => {
    const collection = [
      {
        label: 'Dashboard >',
        path: ROUTES.HOME.path,
      },
      {
        label: 'Klanten >',
        path: ROUTES.CLIENTOVERVIEW.path,
      },
      {
        label: 'Detailpagina',
      },
    ];

    if (current_client && current_client.name) {
      const clientName = current_client.name;
      return (
        <AcPageTitle
          className={getClientTitleClassNames}
          title={clientName}
          collection={collection}
        />
      );
    } else {
      return (
        <div className={getClientDetailClassNames}>
          <AcPageTitle
            className={getClientTitleClassNames}
            title={'Klant'}
            collection={collection}
          />
        </div>
      );
    }
  }, []);

  return (
    <div className={getMainClassNames}>
      {renderPageTitle}
      <AcCardClientDetail id={id} />
      <AcContactTable current_client={current_client} />
    </div>
  );
};

export default withStore(observer(AcContractDetail));
