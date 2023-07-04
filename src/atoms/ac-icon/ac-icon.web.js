// Imports => React
import React, { useMemo, memo } from 'react';
import clsx from 'clsx';

const _CLASSES = {
  MAIN: 'ac-icon',
  PREFIX: 'ac-icon--',
};
// Component
const AcIcon = ({ icon, className, callback }) => {
  const handleCallback = (event) => {
    if (callback) callback(event);
  };

  const getStyleClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN, icon && `${_CLASSES.PREFIX}${icon}`, className);
  }, [icon, className]);

  return <i className={getStyleClassNames} onClick={handleCallback} />;
};

export default memo(AcIcon);
