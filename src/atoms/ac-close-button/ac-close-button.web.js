import React, { useMemo, memo } from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';

// Imports => Contants
import { ICONS } from '@constants';

// Imports => atoms
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-close-button',
  WHITE: 'ac-close-button--white',
  OMEGA: 'ac-close-button--omega',
  LIGHT: 'ac-close-button--light',
  ICON: 'ac-close-button__icon',
};

const AcCloseButton = ({ callback, theme, icon = ICONS.CLOSE }) => {
  const handleClick = () => {
    if (callback) callback();
  };

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.ICON);
  }, []);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN, theme && _CLASSES[theme.toUpperCase()]);
  }, [theme]);

  return (
    <div className={getMainClassNames} onClick={handleClick}>
      <AcIcon icon={icon} className={getIconClassNames} />
    </div>
  );
};

export default withRouter(memo(AcCloseButton));
