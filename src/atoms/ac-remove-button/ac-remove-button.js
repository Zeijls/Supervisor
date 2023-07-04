// Imports => React
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';

// Imports => Constants
import { THEMES, VARIANTS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Import => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';

const AcRemoveButton = ({ onSubmit, store }) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const handleCallback = () => {
    if (onSubmit) onSubmit();
  };

  const getButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      variant: VARIANTS.REMOVE,
      loading: is_loading,
      title: 'Verwijder',
      callback: handleCallback,
    };
  }, [is_loading]);

  const renderRemoveButton = useMemo(() => {
    return (
      <AcButton {...getButtonOptions}>
        <span>Verwijder</span>
      </AcButton>
    );
  });

  return <div>{renderRemoveButton}</div>;
};

export default withRouter(withStore(observer(AcRemoveButton)));
