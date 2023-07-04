// Imports => React
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { THEMES, ICONS, VARIANTS } from '@constants';

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

export const AcPrevStep = ({ store, callback }) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getFormBackIconClassNames = useMemo(() => {
    return clsx(_CLASSES.FORMICON.BACK);
  }, []);

  const getPrevButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      variant: VARIANTS.OUTLINE,
      loading: is_loading,
      title: 'Terug',
      callback: callback,
    };
  }, [is_loading]);

  const renderNextStepButton = () => {
    return (
      <AcButton {...getPrevButtonOptions}>
        <span>
          <AcIcon
            icon={ICONS.ARROW_POINT_LEFT}
            className={getFormBackIconClassNames}
          ></AcIcon>
          Terug
        </span>
      </AcButton>
    );
  };

  return renderNextStepButton();
};

export default withRouter(withStore(observer(AcPrevStep)));
