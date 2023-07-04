// Imports => React
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { THEMES, ICONS, TYPES } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  FORMICON: {
    NEXT: 'ac-form__icon--next',
  },
};

export const AcNextStep = ({ store, callback }) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getFormNextIconClassNames = useMemo(() => {
    return clsx(_CLASSES.FORMICON.NEXT);
  }, []);

  const getAddButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Volgende stap',
      callback: callback,
      disabled: false,
    };
  }, []);

  const renderNextStepButton = () => {
    return (
      <AcButton {...getAddButtonOptions}>
        <span>
          Volgende stap
          <AcIcon
            icon={ICONS.ARROW_POINT_RIGHT}
            className={getFormNextIconClassNames}
          ></AcIcon>
        </span>
      </AcButton>
    );
  };

  return renderNextStepButton();
};

export default withRouter(withStore(observer(AcNextStep)));
