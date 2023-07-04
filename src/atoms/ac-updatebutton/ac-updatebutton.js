// Imports => React
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';

// Imports => Constants
import { THEMES, ICONS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const AcUpdatebutton = ({ onSubmit, id, store, fields, number, onUpdate }) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const handleCallback = (event) => {
    event.preventDefault();
    // console.log(id, 'application id');
    if (onSubmit) onSubmit(number, fields, id);
    if (onUpdate) onUpdate(number, fields, id);
  };

  const getUpdateButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'Bewerken',
      callback: handleCallback,
    };
  }, []);

  const renderUpdateButton = useMemo(() => {
    return (
      <AcButton {...getUpdateButtonOptions}>
        <AcIcon icon={ICONS.PENCIL} />
      </AcButton>
    );
  });

  return <div>{renderUpdateButton}</div>;
};

export default withRouter(withStore(observer(AcUpdatebutton)));
