// Imports => React
import React, { useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, ICONS } from '@constants';

// Imports => Molecules
import AcTabBar from '@molecules/ac-tab-bar/ac-tab-bar';

// Imports => Atoms
import AcPageTitle from '@atoms/ac-page-title/ac-page-title';
import AcDetailContract from '@atoms/ac-detail-contract/ac-detail-contract';
import AcDetailDevelopment from '@atoms/ac-detail-development/ac-detail-development';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  CONTRACTDETAIL: 'ac-contract-detail',
  ICON: 'ac-action-location__icon',
};

const AcContractDetail = ({ store, match }) => {
  const { id } = match.params;
  const { current_contract } = store.contracts;

  useEffect(() => {
    store.contracts.show(id);
  }, [id]);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const getContractDetailClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTRACTDETAIL);
  }, []);

  const renderPageTitle = useMemo(() => {
    const collection = [
      {
        label: 'Dashboard >',
        path: ROUTES.HOME.path,
      },
      {
        label: 'Contracten >',
        path: ROUTES.CONTRACTOVERVIEW.path,
      },
      {
        label: 'Detailpagina',
      },
    ];

    if (!current_contract) {
      return <AcPageTitle title={'Contract'} collection={collection} />;
    } else {
      const contractName = current_contract.name;

      return <AcPageTitle title={contractName} collection={collection} />;
    }
  }, []);

  const [selectedTab, setSelectedTab] = useState('contract');
  const [active, setActive] = useState('contract');

  const Tabs = {
    contract: <AcDetailContract fields={current_contract} id={id} />,
    development: <AcDetailDevelopment fields={current_contract} id={id} />,
  };

  const renderContractDetailPage = useMemo(() => {
    return (
      <div className={getContractDetailClassNames}>
        {renderPageTitle}
        <AcTabBar setSelectedTab={setSelectedTab}></AcTabBar>
        {Tabs[selectedTab]}
      </div>
    );
  });

  return <div className={getMainClassNames}>{renderContractDetailPage}</div>;
};

export default withStore(observer(AcContractDetail));
