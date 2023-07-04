// Imports => React
import React, { useMemo } from 'react';
import clsx from 'clsx';

// Imports => Atoms
import AcPageTitle from '@atoms/ac-page-title/ac-page-title';
import AcDashboardCards from '@atoms/ac-dashboard-cards/ac-dashboard-cards';
import AcDashboardRapportages from '@atoms/ac-dashboard-rapportages/ac-dashboard-rapportages';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  DASHBOARD: {
    MAIN: 'ac-dashboard',
    TITLE: 'ac-dashboard__title',
  },
};

const AcDashboard = () => {
  const getDashboardClassNames = useMemo(() => {
    return clsx(_CLASSES.DASHBOARD.MAIN);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.DASHBOARD.TITLE);
  }, []);

  const renderPageTitle = useMemo(() => {
    const collection = [
      {
        label: '',
      },
    ];

    return <AcPageTitle title={'Dashboard'} collection={collection} />;
  }, []);

  const renderDashboard = () => {
    return (
      <div className={getDashboardClassNames}>
        {renderPageTitle}
        <h5 className={getTitleClassNames}>Bedrijfsoverzicht</h5>
        <AcDashboardCards />
        <AcDashboardRapportages />
      </div>
    );
  };

  return renderDashboard();
};

export default AcDashboard;
