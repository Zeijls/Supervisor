import React, { useEffect } from 'react';
import clsx from 'clsx';

// Imports => Utilities
import { AcRippleEffect } from '@utils';

const _CLASSES = {
  MAIN: 'ac-ripple',
  SIMPLE: 'ac-ripple--simple',
  LIGHT: 'ac-ripple--light',
  WHITE: 'ac-ripple--white',
  DARK: 'ac-ripple--dark',
  ALPHA: 'ac-ripple--alpha',
  OMEGA: 'ac-ripple--omega',
};

const _SIZES = {
  DEFAULT: 5,
  SMALL: 2,
  LARGE: 7.5,
  XLARGE: 10,
};

const AcRipple = ({
  target = false,
  size = 'default',
  theme = 'default',
  simple = false,
  fixed = false,
  event = 'click',
}) => {
  let el = null;
  let ripple = null;

  useEffect(() => {
    initRippleEffect();

    return () => {
      if (ripple) ripple.removeEvents();
    };
  });

  const initRippleEffect = () => {
    const _size = size ? _SIZES[size.toUpperCase()] : 5;

    ripple = new AcRippleEffect(el, target, _size, fixed, event);
  };

  const getStyleClassNames = () => {
    return clsx([
      _CLASSES.MAIN,
      theme && _CLASSES[theme.toUpperCase()],
      simple && _CLASSES.SIMPLE,
    ]);
  };

  return <span ref={(node) => (el = node)} className={getStyleClassNames()} />;
};

export default React.memo(AcRipple);
