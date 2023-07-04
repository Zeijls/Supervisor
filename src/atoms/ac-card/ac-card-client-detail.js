// Imports => React
import React, { useEffect, useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, KEYS } from '@constants';

// Import Molecules
import AcFormClientUpdate from '@molecules/ac-form/ac-form-client-update';

// Imports => Atoms
import AcPageTitle from '@atoms/ac-page-title/ac-page-title';
import AcCardContract from '@atoms/ac-card/ac-card-contract.js';
import AcClientCardClient from '@atoms/ac-card/ac-client-card-client.js';
import AcContactTable from '@atoms/ac-contact-table/ac-contact-table.js';

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

const AcCardClientDetail = ({ store, id }) => {
  const history = useHistory();
  //   const { id } = match.params;
  const { current_client } = store.clients;
  const { is_loading } = store.auth;

  useEffect(() => {
    store.clients.show(id);
  }, [id]);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const getClientCardClassNames = useMemo(() => {
    return clsx(_CLASSES.CLIENTCARD.DETAIL);
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
        <AcPageTitle
          className={getClientTitleClassNames}
          title={'Klant'}
          collection={collection}
        />
      );
    }
  }, []);

  const updateSubmit = async (data) => {
    await store.clients.update(data, id);
    await store.clients.show(id);
    store.ui.reset('modal');
  };

  const handleDelete = async (id) => {
    await store.clients.delete(id);
    await store.ui.reset('modal');
    const redirect = ROUTES.CLIENTOVERVIEW.path;
    history.push(redirect);
  };

  const handleClient = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    await store.clients.show(id);
    const currentClient = current_client;

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <AcFormClientUpdate
            onSubmit={updateSubmit}
            current_client={currentClient}
            onDelete={handleDelete}
            is_loading={is_loading}
          />
        ),
        closeable: true,
        visible: true,
        callback: () => {
          store.ui.reset('modal');
        },
        actions: [],
      });
    });
  };

  const renderClientDetailCard = useMemo(() => {
    if (current_client) {
      return (
        <div className={getClientCardClassNames}>
          <AcClientCardClient
            current_client={current_client}
            id={id}
            onUpdate={handleClient}
          />
          <AcCardContract fields={current_client} />
        </div>
      );
    }
  }, [current_client]);

  const renderClienttDetailPage = useMemo(() => {
    return (
      <div className={getClientDetailClassNames}>{renderClientDetailCard}</div>
    );
  }, [current_client]);

  return <div className={getMainClassNames}>{renderClienttDetailPage}</div>;
};

export default withStore(observer(AcCardClientDetail));
