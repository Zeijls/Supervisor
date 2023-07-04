import React, { useEffect, useMemo, memo } from 'react';
import clsx from 'clsx';

const _CLASSES = {
  MAIN: 'ac-bottom-drawer',
  OMEGA: 'ac-bottom-drawer--omega',
  VISIBLE: 'ac-bottom-drawer--visible',
  FLAT: 'ac-bottom-drawer--flat',
};

const AcBottomDrawer = ({
  visible = false,
  children,
  className,
  theme,
  flat = false,
}) => {
  useEffect(() => {
    const event = new Event('bd-entered');
    document.dispatchEvent(event);

    return () => {
      const event = new Event('bd-left');
      document.dispatchEvent(event);
    };
  }, []);

  useEffect(() => {
    const event = new CustomEvent('bd-visible', { detail: { visible } });
    document.dispatchEvent(event);
  }, [visible]);

  const getMainClassNames = useMemo(() => {
    return clsx(
      _CLASSES.MAIN,
      visible && _CLASSES.VISIBLE,
      theme && _CLASSES[theme.toUpperCase()],
      flat && _CLASSES.FLAT,
      className
    );
  }, [visible, className, theme, flat]);

  return <div className={getMainClassNames}>{children}</div>;
};

export default memo(AcBottomDrawer);
