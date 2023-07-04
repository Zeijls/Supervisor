// Imports => React
import React, { useEffect, useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, ICONS, COLUMNS, THEMES } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Atoms
import AcPageTitle from '@atoms/ac-page-title/ac-page-title';
import AcCardReport from '@atoms/ac-card/ac-card-report.js';
import AcButton from '@atoms/ac-button/ac-button.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  REPORT: {
    DETAIL: {
      MAIN: 'ac-report-detail',
      BUTTONBLOCK: 'ac-report-detail__buttonblock',
    },
  },
};

const AcReportDetail = ({ store, match }) => {
  const { id } = match.params;
  const { current_report } = store.report;
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  useEffect(() => {
    store.report.show(id);
  }, [id]);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const getContractDetailClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.DETAIL.MAIN);
  }, []);

  const getReportButtonBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.DETAIL.BUTTONBLOCK);
  }, []);

  const renderPageTitle = useMemo(() => {
    const collection = [
      {
        label: 'Dashboard >',
        path: ROUTES.HOME.path,
      },
      {
        label: 'Rapportages >',
        path: ROUTES.REPORTOVERVIEW.path,
      },
      {
        label: 'Detailpagina',
      },
    ];

    // if (current_report && current_report.contract.name) {
    //   const reportName = current_report.contract.name;
    //   return (
    //     <AcPageTitle
    //       title={('Rapportage: ', reportName)}
    //       collection={collection}
    //     />
    //   );
    // } else {
    return <AcPageTitle title={'Rapportage'} collection={collection} />;
    // }
  }, [current_report]);

  const renderReportDetailCard = useMemo(() => {
    return <AcCardReport fields={current_report} />;
  });

  const getSendReportButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Verstuur Rapport',
      // callback: ontbreekt nog in API
    };
  }, []);

  const getPDFPreviewButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'PDF Voorvertoning',
      // callback: ontbreekt nog in API
    };
  }, []);

  const renderSendReportButton = useMemo(() => {
    return (
      <div className={getReportButtonBlockClassNames}>
        <AcButton {...getSendReportButtonOptions}>Verstuur Rapportage</AcButton>
        <AcButton {...getPDFPreviewButtonOptions}>Voorvertoning PDF </AcButton>
      </div>
    );
  });

  const renderContractDetailPage = useMemo(() => {
    return (
      <div className={getContractDetailClassNames}>
        {renderPageTitle}
        {renderReportDetailCard}
        {renderSendReportButton}
      </div>
    );
  });

  return <div className={getMainClassNames}>{renderContractDetailPage}</div>;
};

export default withStore(observer(AcReportDetail));
