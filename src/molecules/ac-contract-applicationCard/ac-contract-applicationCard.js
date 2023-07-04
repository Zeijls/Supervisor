// Imports => React
import React, { useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES } from '@constants';

// Imports => Atoms
import AcContractsApplication from '@atoms/ac-contracts-application/ac-contracts-application';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  INFOCARD: {
    APP: 'ac-infoCard__app',
    TITLE: 'ac-infoCard__title',
    SPAN: 'ac-render-detail__span',
  },
};

const AcContractApplicationCard = ({ fields, id }) => {
  const getAppInfoCardClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.APP);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.TITLE);
  }, []);

  const getSpanClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.SPAN);
  }, []);

  const checkApplicationCount = () => {
    if (fields && fields.applications) {
      const collection = fields.applications;
      let collectionLength = Object.keys(collection).length;
      console.log(collectionLength, 'collection length');
      return collectionLength;
    }
  };

  const renderApplicationCard = useMemo(() => {
    return (
      <div className={getAppInfoCardClassNames}>
        <h5 className={getTitleClassNames}>
          Applicaties
          <span className={getSpanClassNames}>{checkApplicationCount()}</span>
        </h5>
        <AcContractsApplication fields={fields} />
      </div>
    );
  });

  return <div>{renderApplicationCard}</div>;
};

export default withRouter(withStore(observer(AcContractApplicationCard)));
