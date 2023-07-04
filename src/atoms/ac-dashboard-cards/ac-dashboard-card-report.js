// Imports => React
import React, { useMemo } from 'react';
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

const AcDashboardCard = ({ store }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const { report_data } = store.report;

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

  const calculateReports = useMemo(() => {
    if (report_data && report_data.meta) {
      const totalCollection = report_data.meta.total;
      return totalCollection;
    }

    return 0;
  }, [store.report.report_data]);

  const handleReportClick = () => {
    const redirect = ROUTES.REPORTOVERVIEW.path;
    history.push(redirect);
  };

  const getDashboardReportCardButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      variant: VARIANTS.CARD,
      className: getDashboardCardClassNames,
      loading: is_loading,
      title: 'Report',
      callback: handleReportClick,
    };
  }, []);

  const renderDashboardCards = useMemo(() => {
    return (
      <AcButton {...getDashboardReportCardButtonOptions}>
        <AcIcon icon={ICONS.NOTEPAD} className={getLayerIconClassNames} />
        <h4 className={getTitleClassNames}>{calculateReports}</h4>
        <p className={getParagraphClassNames}>Rapportages</p>
      </AcButton>
    );
  }, [report_data]);

  return renderDashboardCards;
};

export default withRouter(withStore(observer(AcDashboardCard)));
