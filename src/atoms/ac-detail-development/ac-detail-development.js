// Imports => React
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Import => Molecules
import AcContractApplicationCard from '@molecules/ac-contract-applicationCard/ac-contract-applicationCard';
import AcJiraCard from '@molecules/ac-jira-card/ac-jira-card';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
};

const AcDetailDevelopment = ({ fields, id }) => {
  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  return (
    <div className={getMainClassNames}>
      <AcJiraCard fields={fields} id={id} />
      <AcContractApplicationCard fields={fields} id={id} />
    </div>
  );
};

export default withRouter(withStore(observer(AcDetailDevelopment)));
