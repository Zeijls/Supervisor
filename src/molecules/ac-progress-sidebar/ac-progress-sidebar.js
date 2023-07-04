// Imports => React
import React, { useCallback, useEffect, useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Constants
import { THEMES, ICONS, TYPES, KEYS } from '@constants';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  HEADERDETAIL: 'ac-headers__detail',
  PROGRESS: {
    MAIN: 'ac-progress-sidebar',
    ITEM: 'ac-progress-sidebar__item',
    ITEM_ACTIVE: 'ac-progress-sidebar__item--active',
    BUTTON: 'ac-progress-sidebar__button',
    NUMBER: 'ac-progress-sidebar__number',
    TITLE: 'ac-progress-sidebar__title',
    BORDER: 'ac-progress-sidebar__border',
    LINE: 'ac-progress-sidebar__line',

    TEXT: 'ac-progress-sidebar__text',
    SUBTITLE: 'ac-progress-sidebar__subtitle',
    PARAGRAPH: 'ac-progress-sidebar__paragraph',
  },
};

const AcProgressSidebar = ({ store, navigation }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();
  const { current_step } = store.contracts;

  useEffect(() => {
    store.contacts.index();
  }, []);

  const getProgressSidebarClassNames = useMemo(() => {
    return clsx(_CLASSES.PROGRESS.MAIN);
  }, []);

  const getItemClassNames = useCallback(
    (step) => {
      const activeStep = step === current_step;
      return clsx(
        _CLASSES.PROGRESS.ITEM,
        activeStep && _CLASSES.PROGRESS.ITEM_ACTIVE
      );
    },
    [current_step]
  );

  const getButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.PROGRESS.BUTTON);
  }, []);

  const getBorderClassNames = useMemo(() => {
    return clsx(_CLASSES.PROGRESS.BORDER);
  }, []);

  const getLineClassNames = useMemo(() => {
    return clsx(_CLASSES.PROGRESS.LINE);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.PROGRESS.TITLE);
  }, []);

  const getTextClassNames = useMemo(() => {
    return clsx(_CLASSES.PROGRESS.TEXT);
  }, []);

  const getSubtitleClassNames = useMemo(() => {
    return clsx(_CLASSES.PROGRESS.SUBTITLE);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.PROGRESS.PARAGRAPH);
  }, []);

  const handleClient = (navigation) => {
    store.contracts.setStepOne();
    navigation.go('AcFormClientItems');
  };

  const handleContact = (navigation) => {
    store.contracts.setStepTwo();
    navigation.go('AcFormContactItems');
  };

  const handleContract = (navigation) => {
    store.contracts.setStepTwi();
    navigation.go('AcFormContractNew');
  };

  const getClientSidebarButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'ClientStep',
      // callback: handleClient(navigation),
    };
  }, [is_loading]);

  const getContactSidebarButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'ContactStep',
      // callback: handleContact(navigation),
    };
  }, [is_loading]);

  const getContractSidebarButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'ContractStep',
      // callback: handleContract(navigation),
    };
  }, [is_loading]);

  const renderProgressSidebar = useMemo(() => {
    return (
      <div className={getProgressSidebarClassNames}>
        <div className={getButtonClassNames}>
          <div className={getItemClassNames(1)}>
            <div className={getBorderClassNames}>
              <div className={getLineClassNames}></div>
              <h1 className={getTitleClassNames}>01</h1>
            </div>

            <div className={getTextClassNames}>
              <p className={getParagraphClassNames}>Stap 01</p>
              <h3 className={getSubtitleClassNames}>Klantgegevens</h3>
            </div>
          </div>
        </div>

        <div className={getButtonClassNames}>
          <div className={getItemClassNames(2)}>
            <div className={getBorderClassNames}>
              <div className={getLineClassNames}></div>
              <h1 className={getTitleClassNames}>02</h1>
            </div>
            <div className={getTextClassNames}>
              <p className={getParagraphClassNames}>Stap 02</p>
              <h3 className={getSubtitleClassNames}>Contactgegevens</h3>
            </div>
          </div>
        </div>

        <div className={getButtonClassNames}>
          <div className={getItemClassNames(3)}>
            <div className={getBorderClassNames}>
              <div className={getLineClassNames}></div>
              <h1 className={getTitleClassNames}>03</h1>
            </div>
            <div className={getTextClassNames}>
              <p className={getParagraphClassNames}>Stap 03</p>
              <h3 className={getSubtitleClassNames}>Contractgegevens</h3>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return <div>{renderProgressSidebar}</div>;
};

export default withRouter(withStore(observer(AcProgressSidebar)));
