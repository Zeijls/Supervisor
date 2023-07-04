import React, { useCallback, useMemo, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { DEFAULT_ROUTE, NAVIGATION_ITEMS } from '@constants';

// Imports => Components
import AcNavigation from '@components/ac-navigation/ac-navigation.web';

// Imports => Atoms
import AcLogo from '@atoms/ac-logo/ac-logo.web';
import AcSearchBar from '@atoms/ac-search-bar/ac-search-bar';

const _CLASSES = {
  MAIN: 'ac-header',
  WHITE: 'ac-header--white',
  ALPHA: 'ac-header--alpha',
  OMEGA: 'ac-header--omega',
};

const AcHeader = ({
  store: { auth },
  children,
  withLogo = true,
  withNavigation = true,
  theme,
}) => {
  const history = useHistory();

  const backToHome = useCallback((event) => {
    if (event && event.persist) event.persist();
    if (event && event.preventDefault) event.preventDefault();

    const { push } = history;
    if (push) push(DEFAULT_ROUTE.path);
  }, []);

  const getFilteredRoutes = useMemo(() => {
    const routes = NAVIGATION_ITEMS;
    return routes.filter((route) => {
      return route.forbidden ? auth.is_authorized : true;
    });
  }, [auth.is_authorized]);

  const renderLogo = useMemo(() => {
    return <AcLogo callback={backToHome} />;
  }, [withLogo]);

  const renderNavigation = useMemo(() => {
    return <AcNavigation routes={getFilteredRoutes} />;
  }, [withNavigation, getFilteredRoutes]);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN, theme && _CLASSES[theme.toUpperCase()]);
  }, [theme]);

  return (
    <header className={getMainClassNames} id={'ac-header'}>
      {withLogo && renderLogo}
      {children}
      {withNavigation && renderNavigation}
    </header>
  );
};

export default withStore(observer(AcHeader));
