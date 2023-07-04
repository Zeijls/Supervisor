// Imports => React
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { THEMES, VARIANTS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Import => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';

const AcCancelButton = ({ store }) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getSaveButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      variant: VARIANTS.OUTLINE,
      loading: is_loading,
      title: 'Gegevens tijdelijk opslaan',
    };
  }, [is_loading]);

  const renderCancelButton = useMemo(() => {
    return (
      <AcButton {...getSaveButtonOptions}>
        <span> Afbreken</span>
      </AcButton>
    );
  });

  return <div>{renderCancelButton}</div>;
};

export default withRouter(withStore(observer(AcCancelButton)));
