// Imports => React
import React, { useMemo } from 'react';
import clsx from 'clsx';

import AcDashboardCardContractNew from '@atoms/ac-dashboard-cards/ac-dashboard-card-contract-new';
import AcDashboardCardContract from '@atoms/ac-dashboard-cards/ac-dashboard-card-contract';
import AcDashboardCardClient from '@atoms/ac-dashboard-cards/ac-dashboard-card-client';
import AcDashboardCardReport from '@atoms/ac-dashboard-cards/ac-dashboard-card-report';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  OVERVIEW: {
    MAIN: 'ac-dashboard-card__overview',
  },
};

const AcDashboardCards = () => {
  const getDashboardOverviewClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.MAIN);
  }, []);

  const renderDashboardCards = useMemo(() => {
    return (
      <div className={getDashboardOverviewClassNames}>
        <AcDashboardCardContractNew />
        <AcDashboardCardContract />
        <AcDashboardCardClient />
        <AcDashboardCardReport />
      </div>
    );
  }, []);

  return renderDashboardCards;
};

export default AcDashboardCards;
