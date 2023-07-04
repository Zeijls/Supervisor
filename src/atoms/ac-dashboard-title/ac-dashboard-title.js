// Imports => React
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  HEADERS: {
    MAIN: 'ac-headers',
    TITLE: 'ac-headers__title',
  },
};

const AcDashboardTitle = () => {
  const getHeadersClassNames = useMemo(() => {
    return clsx(_CLASSES.HEADERS.MAIN);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.HEADERS.TITLE);
  }, []);

  const renderClientTitle = useMemo(() => {
    return <h1 className={getTitleClassNames}>Dashboard</h1>;
  });

  return <div className={getHeadersClassNames}>{renderClientTitle}</div>;
};

export default withRouter(withStore(observer(AcDashboardTitle)));
