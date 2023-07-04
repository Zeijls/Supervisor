// Imports => React
import React, { useMemo, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  REPORT: {
    MAIN: 'ac-card-report',
    BLOCK: 'ac-card-report__block',
    BLOCK_HEADER: 'ac-card-report__block-header',
    ITEM: 'ac-card-report__item',
    HEADER: 'ac-card-report__header',
    TITLE: 'ac-card-report__title',
    LABEL: 'ac-card-report__label',
    PARAGRAPH: 'ac-card-report__paragraph',
  },
};

const AcLogsJira = ({ store }) => {
  const getReportCardClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.MAIN);
  }, []);

  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.BLOCK);
  }, []);

  const getBlockHeaderClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.BLOCK_HEADER);
  }, []);

  const getItemClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.ITEM);
  }, []);

  const getTitleClassName = useMemo(() => {
    return clsx(_CLASSES.REPORT.TITLE);
  }, []);

  const getLabelClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.LABEL);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.REPORT.PARAGRAPH);
  }, []);

  // Header
  const renderHeader = useMemo(() => {
    return (
      <div className={getBlockHeaderClassNames}>
        <h4 className={getLabelClassNames}>Ticket</h4>
        <h4 className={getLabelClassNames}>Omschrijving</h4>
        <h4 className={getLabelClassNames}>Datum</h4>
        <h4 className={getLabelClassNames}>Opgelost door </h4>
      </div>
    );
  });

  // JIRA tickets
  const checkJiraLogs = () => {
    const { jira_logs } = store.report;
    if (jira_logs) {
      let collection = jira_logs;

      const len = collection.length;
      let number = 0;
      let result = [];

      for (number; number < len; number++) {
        const item = collection[number];

        const object = (
          <div className={getItemClassNames}>
            <p className={getParagraphClassNames}>{item.id}</p>
            <p className={getParagraphClassNames}>{item.source}</p>
            <p className={getParagraphClassNames}>{item.created_at}</p>
            <p className={getParagraphClassNames}>{item.updated_at}</p>
          </div>
        );
        result.push(object);
      }
      return result;
    } else return null;
  };

  const renderServiceRequests = useMemo(() => {
    return (
      <div className={getReportCardClassNames}>
        <h1 className={getTitleClassName}>Afgehandelde Service Verzoeken</h1>
        {renderHeader}
        <div className={getBlockClassNames}>{checkJiraLogs()}</div>
      </div>
    );
  });

  return renderServiceRequests;
};

export default withRouter(withStore(observer(AcLogsJira)));
