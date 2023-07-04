// Imports => React
import React, { useEffect, useMemo } from 'react';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import { Switch, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import clsx from 'clsx';

// Imports => SCSS
import '@styles/index.scss';

// Imports => Constants
import {
  AUTHENTICATION_ROUTES,
  DEFAULT_ROUTE,
  KEYS,
  TITLES,
  ROUTES,
} from '@constants';

import { AcUUID } from '@utils';

// Imports => Molecules
import AcToasterHoc from '@molecules/ac-toaster-hoc/ac-toaster-hoc.web';
import AcModal from '@molecules/ac-modal/ac-modal.web';

// Imports => Atoms
import AcErrorBoundary from '@atoms/ac-error-boundary/ac-error-boundary.web';
import AcPrivateRoute from '@atoms/ac-private-route/ac-private-route.web';
import AcScrollHOC from '@atoms/ac-scroll-hoc/ac-scroll-hoc.web';
import AcHeader from '@atoms/ac-header/ac-header.web';

const _CLASSES = {
  ROOT: 'ac-root',
  MAIN: 'ac-app',
  ROUTE: {
    SECTION: 'ac-route__section',
  },
};

const App = ({
  match,
  store,
  store: {
    profile,
    auth: { loaded, is_authorized },
    toasters,
    ui,
  },
}) => {
  const location = useLocation();

  useEffect(() => {
    handleRouteChanged();
  }, [location]);

  const handleRouteChanged = (event) => {
    // if (is_authorized) profile.who_am_i();
  };

  const getRouteSectionClassNames = useMemo(() => {
    return clsx(_CLASSES.ROUTE.SECTION);
  }, []);

  const renderDefaultRoute = useMemo(() => {
    return (
      <AcPrivateRoute
        component={DEFAULT_ROUTE.component}
        forbidden={DEFAULT_ROUTE.forbidden}
        store={store}
      />
    );
  }, [is_authorized]);

  const authorized = useMemo(() => {
    const notAnAuthorizationRoute =
      AUTHENTICATION_ROUTES.indexOf(location.pathname) === -1;

    return is_authorized && notAnAuthorizationRoute;
  }, [is_authorized, location]);

  const renderModal = useMemo(() => {
    console.log('ui.current_modal', ui.current_modal);
    return (
      <AcModal key={ui.current_modal.id} {...ui.current_modal}>
        {ui.current_modal.body}
      </AcModal>
    );
  }, [
    ui.current_modal,
    ui.current_modal.body,
    ui.current_modal.title,
    ui.current_modal.visible,
    ui.current_modal.closeable,
  ]);

  const renderToasterHoc = useMemo(() => {
    return <AcToasterHoc queue={toasters.queue} callback={toasters.remove} />;
  }, [toasters, toasters.queue]);

  return (
    <AcErrorBoundary screen={location.pathname}>
      <AcScrollHOC>
        <main>
          {authorized && <AcHeader withMessageCenter withNavigation />}

          <section id={KEYS.SCROLLER} className={getRouteSectionClassNames}>
            <TransitionGroup>
              <CSSTransition
                key={location.key}
                timeout={{ enter: 300, exit: 300 }}
                classNames={'fade'}
              >
                <Switch location={location}>
                  {ROUTES &&
                    Object.keys(ROUTES)
                      .filter((route) =>
                        ROUTES[route].forbidden ? is_authorized : true
                      )
                      .map((route) => (
                        <AcPrivateRoute
                          key={`route-${ROUTES[route].id}`}
                          name={ROUTES[route].name}
                          path={ROUTES[route].path}
                          component={ROUTES[route].component}
                          forbidden={ROUTES[route].forbidden}
                          authorized={is_authorized}
                          store={store}
                          exact={ROUTES[route].exact}
                        />
                      ))}
                  {DEFAULT_ROUTE && renderDefaultRoute}
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </section>

          {renderModal}

          {renderToasterHoc}
        </main>
      </AcScrollHOC>
    </AcErrorBoundary>
  );
};

export default withStore(observer(App));
