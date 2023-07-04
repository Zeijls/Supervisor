// Imports => React
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES } from '@constants';

// Imports => Hooks
import { useOverviewActions } from '@hooks';

// Imports => Atoms
import AcPageTitle from '@atoms/ac-page-title/ac-page-title';
import AcClientTable from '@atoms/ac-client-table/ac-client-table.js';

const _CLASSES = {
  MAIN: 'ac-home ac-page',
  OVERVIEW: 'ac-overview',
};

const AcClientOverview = ({ store }) => {
  const { is_loading } = store.auth;
  const history = useHistory();
  const { handlePagination, handleSort, handleSearch } = useOverviewActions(
    store.clients
  );

  const { client_data } = store.clients;
  const { search_image } = store.clients;

  useEffect(() => {
    store.clients.index();
    store.clients.setPerPage(5);
  }, [search_image]);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const getOverviewClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW);
  }, []);

  const handleClick = (id) => {
    const route = ROUTES.CLIENTDETAIL.path.replace(':id', id);
    history.push(route);
  };

  const renderPageTitle = useMemo(() => {
    const collection = [
      {
        label: 'Dashboard >',
        path: ROUTES.HOME.path,
      },
      {
        label: 'Klantenoverzicht',
      },
    ];

    return <AcPageTitle title={'Klanten overzicht'} collection={collection} />;
  }, []);

  const renderClientOverviewPage = useMemo(() => {
    return (
      <div className={getOverviewClassNames}>
        {renderPageTitle}
        <AcClientTable
          onClick={handleClick}
          is_loading={is_loading}
          handlePagination={handlePagination}
          handleSort={handleSort}
          handleSearch={handleSearch}
          client_data={client_data}
          search_image={search_image}
        />
      </div>
    );
  });

  return <div className={getMainClassNames}>{renderClientOverviewPage}</div>;
};

export default withStore(observer(AcClientOverview));
