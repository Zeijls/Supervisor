// Imports => React
import React, { useEffect, useMemo, useRef } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, SIZES, THEMES } from '@constants';

// Imports => Utilities
import { AcIndicator, AcIsSet, AcIsObject } from '@utils';

// Imports => Atoms
import AcIcon from '@atoms/ac-icon/ac-icon.web';
import AcRipple from '@atoms/ac-ripple/ac-ripple.web';

const _CLASSES = {
  MAIN: 'ac-navigation',
  VISIBLE: 'ac-navigation--visible',
  NAVLIST: {
    MAIN: 'ac-navigation__list',
  },
  NAVLISTITEM: {
    MAIN: 'ac-navigation__item',
  },
  NAVLINK: {
    MAIN: 'ac-navigation__link',
    ACTIVE: 'ac-navigation__link--active',
    ICON: 'ac-navigation__link__icon',
  },
  INDICATOR: {
    MAIN: 'ac-navigation__indicator',
    STATIC: 'ac-navigation__indicator--static',
    LEFT: 'ac-navigation__indicator--move-left',
    RIGHT: 'ac-navigation__indicator--move-right',
  },
};

let unlisten = null;
let indicator = null;

const AcNavigation = ({
  store: { ui },
  indicate = true,
  routes,
  className,
}) => {
  const $indicator = useRef(null);
  const $navigation = useRef(null);

  const history = useHistory();

  useEffect(() => {
    const _unlisten = history.listen((location) => {
      subscribe(location);
    });
    unlisten = _unlisten;

    if (!AcIsSet(indicator)) {
      indicator = new AcIndicator(
        $navigation,
        $indicator,
        routes,
        _CLASSES.INDICATOR
      );

      init();
    } else if (
      AcIsSet(indicator) &&
      AcIsSet(indicator.update) &&
      indicator.routes !== routes
    ) {
      indicator.update(routes).then(() => {
        init();
      });
    }

    return () => {
      if (unlisten) unlisten();
      if (AcIsSet(indicator) && AcIsSet(indicator.unload)) {
        indicator.unload().then(() => {
          indicator = null;
        });
      }
    };
  }, [$indicator, $navigation, routes]);

  const subscribe = (location) => {
    let found = false;
    let n = 0;
    let len = routes.length;

    for (n; n < len; n++) {
      const item = routes[n];
      let active = false;

      const { parent, children } = item;

      if (!AcIsSet(parent) || !AcIsSet(children)) {
        active = item.path === location.pathname;
      } else if (AcIsSet(parent) && AcIsSet(children)) {
        active = getParent(location, item);
      }

      if (active) {
        found = AcIsObject(active) ? active : item;
        handleClickEvent({}, found);
        break;
      }
    }

    if (!found && indicator) {
      indicator.reset();
    } else if (found && indicator) {
      indicator.recalculate({}, found);
    }
  };

  const init = () => {
    window.requestAnimationFrame(() => {
      const { location } = history;
      let n = 0;
      let len = routes.length;

      for (n; n < len; n++) {
        const route = routes[n];

        if (route.path === location.pathname) {
          if (route.$ref) {
            const $href = route.$ref.querySelector('a');
            if ($href) $href.click();
          }

          break;
        }
      }
    });
  };

  const handleClickEvent = (event, route) => {
    if (route.callback) route.callback(event, route);
  };

  const isActive = (match, location) => {
    return match !== null ? match.url === location.pathname : false;
  };

  const getNavLinkClassNames = (route, active) => {
    return clsx(_CLASSES.NAVLINK.MAIN, active && _CLASSES.NAVLINK.ACTIVE);
  };

  const getNavLinkIconClassNames = useMemo(() => {
    return clsx(_CLASSES.NAVLINK.ICON);
  }, []);

  const getNavListItemClassNames = useMemo(() => {
    return clsx(_CLASSES.NAVLISTITEM.MAIN);
  }, []);

  const getNavListClassNames = useMemo(() => {
    return clsx(_CLASSES.NAVLIST.MAIN);
  }, []);

  const getIndicatorClassNames = useMemo(() => {
    return clsx(_CLASSES.INDICATOR.MAIN);
  }, []);

  const getStyleClassNames = useMemo(() => {
    const { navigation } = ui;

    return clsx(
      _CLASSES.MAIN,
      navigation && navigation.visible && _CLASSES.VISIBLE,
      className && className
    );
  }, [ui.navigation]);

  const renderRoutes = useMemo(() => {
    let n = 0;
    let len = routes.length;
    let collection = [];

    for (n; n < len; n++) {
      const object = routes[n];

      if (object !== 'break') {
        const $item = (
          <li
            key={object.id}
            ref={(node) => (object.$ref = node)}
            className={getNavListItemClassNames}
            role={'presentation'}
            itemProp={'name'}
          >
            <NavLink
              to={object.path}
              className={getNavLinkClassNames(object)}
              activeClassName={getNavLinkClassNames(object, 'active')}
              title={object.label}
              isActive={isActive}
              itemProp={'url'}
              role={'menuitem'}
              exact
              strict
            >
              {object.icon && (
                <AcIcon
                  icon={object.icon}
                  className={getNavLinkIconClassNames}
                />
              )}
              {object.label}
              <AcRipple theme={THEMES.LIGHT} size={SIZES.SMALL} simple />
            </NavLink>
          </li>
        );

        collection.push($item);
      }
    }

    return collection;
  }, [routes]);

  return (
    <nav ref={$navigation} role={'navigation'} className={getStyleClassNames}>
      <ul
        className={getNavListClassNames}
        role={'menubar'}
        itemScope
        itemType={'http://www.schema.org/SiteNavigationElement'}
      >
        {routes && renderRoutes}
      </ul>

      {indicate && <span ref={$indicator} className={getIndicatorClassNames} />}
    </nav>
  );
};

export default withStore(observer(AcNavigation));
