// Imports => React
import React, { useMemo, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  REPORT: {
    MAIN: 'ac-card-report',
    BLOCK: 'ac-card-report__block',
    HEADER: 'ac-card-report__header',
    TITLE: 'ac-card-report__title',
    LABEL: 'ac-card-report__label',
    PARAGRAPH: 'ac-card-report__paragraph',
  },
};

// Imports => Atoms
import AcLogsJira from '@atoms/ac-report-logs/ac-logs-jira';
import AcLogsOther from '@atoms/ac-report-logs/ac-logs-other';

const AcCardReport = ({ id, store }) => {
  const { current_report } = store.report;

  useEffect(() => {
    store.report.show(id);
  }, [id]);

  const getReportCardClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.MAIN);
  }, []);

  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.BLOCK);
  }, []);

  const getHeaderClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.HEADER);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.TITLE);
  }, []);

  const getLabelClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.LABEL);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.PARAGRAPH);
  }, []);

  // Algemene informatie over rapportage
  const renderReportInfo = useMemo(() => {
    if (current_report) {
      console.log(current_report, 'current report');
      const current_contract = current_report.contract;
      return (
        <div className={getReportCardClassNames}>
          <h1 className={getTitleClassNames}>
            Contract: {current_contract.name}
          </h1>
          <div className={getBlockClassNames}>
            <div className={getHeaderClassNames}>
              <h4 className={getLabelClassNames}>Aangemaakt op</h4>
              <p className={getParagraphClassNames}>
                {current_report.created_at}
              </p>
              <h4 className={getLabelClassNames}>Aangemaakt door</h4>
              <p className={getParagraphClassNames}>
                {current_report.creator.name}
              </p>
              <h4 className={getLabelClassNames}>Omschrijving </h4>
              <p className={getParagraphClassNames}>{current_report.comment}</p>
            </div>
          </div>
        </div>
      );
    } else return null;
  });

  // Filter JIRA & andere tickets
  const checkJiraServices = useMemo(() => {
    if (current_report && current_report.logs) {
      let collection = current_report.logs;

      const len = collection.length;
      let number = 0;

      for (number; number < len; number++) {
        const item = collection[number];

        if (item.source === 'jira') {
          store.report.setJiraLog(item);
        } else {
          store.report.setOtherLog(item);
        }
      }
    }
  }, [current_report]);

  return (
    <div>
      {renderReportInfo}
      {checkJiraServices}
      <AcLogsJira />
      <AcLogsOther />
    </div>
  );
};

export default withRouter(withStore(observer(AcCardReport)));
