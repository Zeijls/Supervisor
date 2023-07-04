// Imports => React
import React, { useCallback, useMemo, useEffect, useRef } from 'react';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { THEMES, ICONS } from '@constants';

// Imports => Utilities
import { AcIndicator, AcIsSet, AcUUID } from '@utils';

// Import => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  TABBAR: {
    MAIN: 'ac-tab-bar',
    TABS: 'ac-tab-bar__tabs',
    ICON: 'ac-tab-bar__icon',
    TAB: 'ac-tab-bar__tab',
    TAB_ACTIVE: 'ac-tab-bar__tab--active',
  },
  INDICATOR: {
    MAIN: 'ac-tab-bar__indicator',
    STATIC: 'ac-tab-bar__indicator--static',
    LEFT: 'ac-tab-bar__indicator--move-left',
    RIGHT: 'ac-tab-bar__indicator--move-right',
  },
};

let tabIndicator = null;
let unlisten = null;

const AcTabbar = ({ setSelectedTab, store, indicate = true }) => {
  const $indicator = useRef(null);
  const $tabbar = useRef(null);

  const { current_tab } = store.contracts;
  const { is_loading } = store.auth;

  const tabs = [
    {
      id: AcUUID(),
      key: 'contract',
      title: 'Contract',
      icon: ICONS.FOLDER,
      $ref: null,
    },
    {
      id: AcUUID(),
      key: 'development',
      title: 'Koppelingen beheren',
      icon: ICONS.ALBUMS,
      $ref: null,
    },
  ];

  const getTabBarClassNames = useMemo(() => {
    return clsx(_CLASSES.TABBAR.MAIN);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.TABBAR.ICON);
  }, []);

  const getIndicatorClassNames = useMemo(() => {
    return clsx(_CLASSES.INDICATOR.MAIN);
  }, []);

  const getTabClassNames = useCallback(
    (key) => {
      if (current_tab === key) {
        return clsx(_CLASSES.TABBAR.TAB_ACTIVE);
      } else {
        return clsx(_CLASSES.TABBAR.TAB);
      }
    },
    [current_tab]
  );

  useEffect(() => {
    if (!AcIsSet(tabIndicator)) {
      tabIndicator = new AcIndicator(
        $tabbar,
        $indicator,
        tabs,
        _CLASSES.INDICATOR
      );
      tabIndicator.init();
    } else if (
      AcIsSet(tabIndicator) &&
      AcIsSet(tabIndicator.update) &&
      tabIndicator.routes !== tabs
    ) {
      tabIndicator.unload().then((instance) => {
        tabIndicator = instance.update(tabs);
        tabIndicator.init();
      });
    }

    return () => {
      if (unlisten) unlisten();
      if (AcIsSet(tabIndicator) && AcIsSet(tabIndicator.unload)) {
        tabIndicator.unload().then(() => {
          tabIndicator = null;
        });
      }
    };
  }, [$indicator, $tabbar, tabs]);

  const handleCurrentTab = (key) => {
    store.contracts.setCurrentTab(key);
    setSelectedTab(key);
  };

  const renderTabs = useMemo(() => {
    const collection = tabs;
    const len = collection.length;
    let n = 0;
    let result = [];

    for (n; n < len; n++) {
      let item = collection[n];

      const options = {
        ...item,
        theme: THEMES.TAB,
        loading: is_loading,
        callback: () => handleCurrentTab(item.key),
        className: getTabClassNames(item.key),
      };

      const object = (
        <AcButton {...options} key={item.id} ref={(node) => (item.$ref = node)}>
          <span>
            <AcIcon icon={item.icon} className={getIconClassNames} />
            {item.title}
          </span>
        </AcButton>
      );

      result.push(object);
    }

    return result;
  }, [tabs, current_tab, is_loading]);

  const renderTabBar = useMemo(() => {
    return (
      <div className={getTabBarClassNames} ref={$tabbar}>
        {renderTabs}

        {indicate && (
          <span ref={$indicator} className={getIndicatorClassNames} />
        )}
      </div>
    );
  });

  return <div>{renderTabBar}</div>;
};

export default withStore(observer(AcTabbar));
