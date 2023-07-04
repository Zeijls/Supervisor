// Imports => React
import React, { useMemo, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, ICONS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Import => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  OVERVIEW: {
    CARD: 'ac-dashboard-card__card',
    TITLE: 'ac-dashboard-card__title',
    PARAGRAPH: 'ac-dashboard-card__paragraph',
    BUTTON: 'ac-dashboard-card__button',
    ICON: {
      LAYER: 'ac-dashboard-card__layer',
    },
  },
};

const AcDashboardCardClient = ({ store }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const { client_data } = store.clients;

  useEffect(() => {
    store.clients.index();
  }, []);

  const getDashboardCardClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.CARD);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.TITLE);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.PARAGRAPH);
  }, []);

  const getLayerIconClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.ICON.LAYER);
  }, []);

  const calculateClients = useMemo(() => {
    if (client_data && client_data.meta) {
      const totalCollection = client_data.meta.total;
      return totalCollection;
    }

    return 0;
  }, [store.clients.client_data]);

  const handleClientClick = () => {
    const redirect = ROUTES.CLIENTOVERVIEW.path;
    history.push(redirect);
  };

  const getDashboardClientCardButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      variant: VARIANTS.CARD,
      className: getDashboardCardClassNames,
      loading: is_loading,
      title: 'Client',
      callback: handleClientClick,
    };
  }, []);

  const renderDashboardCards = useMemo(() => {
    return (
      <AcButton {...getDashboardClientCardButtonOptions}>
        <AcIcon icon={ICONS.PEOPLE} className={getLayerIconClassNames} />
        <h4 className={getTitleClassNames}>{calculateClients}</h4>
        <p className={getParagraphClassNames}>Klanten</p>
      </AcButton>
    );
  }, [client_data]);

  return renderDashboardCards;
};

export default withRouter(withStore(observer(AcDashboardCardClient)));
