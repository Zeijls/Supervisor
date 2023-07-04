// Imports => React
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, COLUMNS, KEYS } from '@constants';

// Imports => Hooks
import { useOverviewActions } from '@hooks';

// Imports => Components
import AcTable from '@components/ac-table/ac-table.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  CLIENTS: 'ac-clients',
  CONTRACTS: 'ac-dashboard-rapportages',
  HEADER: 'ac-dashboard-rapportages__header',
  TITLE: 'ac-dashboard-rapportages__title',
  SPAN: 'ac-render-overview__span',
};

const AcDashboardRapportages = ({ store }) => {
  const history = useHistory();
  const { handlePagination, handleSort, handleSearch } = useOverviewActions(
    store.report
  );
  const { report_data } = store.report;

  useEffect(() => {
    store.report.setSort('to_date', KEYS.ASCENDING);
    store.report.setPerPage(5);
    store.report.index();
  }, []);

  const getDashboardContractsClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTRACTS);
  }, []);

  const getHeaderClassNames = useMemo(() => {
    return clsx(_CLASSES.HEADER);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.TITLE);
  }, []);

  const getSpanClassNames = useMemo(() => {
    return clsx(_CLASSES.SPAN);
  }, []);

  const renderReports = useMemo(() => {
    if (store.report.is_loading) return <AcLoader loading={true} />;
    if (!report_data) return null;

    const { data, meta } = report_data;
    if (!data || data.length === 0) return null;
    const options = {
      columns: COLUMNS.REPORT,
      rows: data.slice(0, 5),
      pagination: null,
      sortby: store.report.current_order_by,
      onSort: handleSort,
      // onPaginate: handlePagination,
      onRowClick: (object) => {
        if (!object) return;
        const { id } = object;
        const { push } = history;
        if (push && id) {
          const route = ROUTES.REPORTDETAIL.path.replace(':id', id);
          push(route);
        }
      },
    };
    return <AcTable {...options} />;
  }, [report_data, store.report.is_loading, store.report.current_order_by]);

  const renderRapportageOverview = useMemo(() => {
    return (
      <div className={getHeaderClassNames}>
        <h5 className={getTitleClassNames}>
          Mijn te versturen rapportages
          <span className={getSpanClassNames}>10</span>
        </h5>
      </div>
    );
  });

  return (
    <div className={getDashboardContractsClassNames}>
      {renderRapportageOverview}
      {renderReports}
    </div>
  );
};

export default withStore(observer(AcDashboardRapportages));
