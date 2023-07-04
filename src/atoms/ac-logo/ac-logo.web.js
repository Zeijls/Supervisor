// Imports => React
import React, { useCallback, useMemo, memo } from 'react';
import clsx from 'clsx';

// Imports => Constants
import { DEFAULT_ROUTE } from '@constants';

const _CLASSES = {
  MAIN: 'ac-logo',
  CONTAINER: {
    MAIN: 'ac-logo__container',
  },
};

// Component
const AcLogo = ({ callback }) => {
  const getContainerClassNames = useCallback(() => {
    return clsx(_CLASSES.CONTAINER.MAIN);
  }, []);

  const getStyleClassNames = useCallback(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const renderLogo = useMemo(() => {
    return 'Supervisor';
  });

  return (
    <a
      href={DEFAULT_ROUTE.path}
      className={getStyleClassNames()}
      onClick={callback}
      title={'Supervisor'}
    >
      <div className={getContainerClassNames()}>{renderLogo}</div>
    </a>
  );
};

export default memo(AcLogo);
