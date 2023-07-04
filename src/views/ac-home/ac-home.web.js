// Imports => React
import React, { useEffect, useMemo } from 'react';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Atoms
import AcDashboard from '@molecules/ac-dashboard/ac-dashboard';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  GRID: 'ac-home__grid',
  HEADER: 'ac-home__header',
  CONTENT: 'ac-home__content',
  NAVBAR: 'ac-home__navbar',
};

const AcHome = () => {
  useEffect(() => {}, []);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const getGridClassNames = useMemo(() => {
    return clsx(_CLASSES.GRID);
  }, []);

  const getContentClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTENT);
  }, []);

  const renderHomePage = useMemo(() => {
    return (
      <div className={getGridClassNames}>
        <div className={getContentClassNames}>
          <AcDashboard />
        </div>
      </div>
    );
  });

  return <div className={getMainClassNames}>{renderHomePage}</div>;
};

export default withStore(observer(AcHome));
