// Imports => React
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Molecules
import AcContractClientCard from '@molecules/ac-contract-clientCard/ac-contract-clientCard';
import AcContractInfoCard from '@molecules/ac-contract-infoCard/ac-contract-infoCard';

// Imports => Atoms
import AcContractsRapportages from '@atoms/ac-contracts-rapportages/ac-contracts-rapportages';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
};

const AcDetailContract = ({ fields, id }) => {
  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  return (
    <div className={getMainClassNames}>
      <AcContractClientCard fields={fields} id={id} />
      <AcContractInfoCard fields={fields} id={id} />
      <AcContractsRapportages fields={fields} />
    </div>
  );
};

export default withRouter(withStore(observer(AcDetailContract)));
