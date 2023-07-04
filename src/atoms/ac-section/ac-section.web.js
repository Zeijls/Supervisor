// Imports => React
import React from 'react';
import clsx from 'clsx';

// Imports => Constants
import { THEMES } from '@constants';

const _CLASSES = {
  MAIN: 'ac-section',
  OFFSET: 'ac-section--offset-top',
  FULLHEIGHT: 'ac-section--fullheight',
  DENSE: 'ac-section--dense',
  DEFAULT: 'ac-section--default',
  TRANSPARENT: 'ac-section--transparent',
  WHITE: 'ac-section--white',
  LIGHT: 'ac-section--light',
  SUBTLE: 'ac-section--subtle',
  MEDIUM: 'ac-section--medium',
  DARK: 'ac-section--dark',
  PITCH: 'ac-section--pitch',
  ALPHA: 'ac-section--alpha',
  OMEGA: 'ac-section--omega',
};
// Component
const AcSection = ({
  children,
  id,
  theme = THEMES.WHITE,
  dense = false,
  offset = false,
  fullheight = false,
  className,
}) => {
  const getStyleClassNames = () => {
    return clsx(
      _CLASSES.MAIN,
      theme && _CLASSES[theme.toUpperCase()],
      dense && _CLASSES.DENSE,
      offset && _CLASSES.OFFSET,
      fullheight && _CLASSES.FULLHEIGHT,
      className
    );
  };

  return (
    <section className={getStyleClassNames()} id={id}>
      {children}
    </section>
  );
};

export default React.memo(AcSection);
