// Imports => React
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, ICONS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Molecules
import AcProgressSidebar from '@molecules/ac-progress-sidebar/ac-progress-sidebar';
import AcForm from '@molecules/ac-form/ac-form';

// Imports => Atoms
import AcPageTitle from '@atoms/ac-page-title/ac-page-title';
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  NEWCONTRACT: {
    MAIN: 'ac-contract-new',
    HEADER: 'ac-contract-new__header',
    HEADERDETAIL: 'ac-headers__detail',
    ADDNEW: 'ac-contract-new__add',
    PROGRESS: 'ac-contract-new__progress',
    FORM: 'ac-contract-new__form',
    CLOSEBUTTON: {
      ICON: 'ac-contract-new__icon',
    },
  },
};

const AcContractNew = ({ store, navigation }) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();
  const history = useHistory();

  useEffect(() => {
    store.contacts.index();
  }, []);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const getNewContractClassNames = useMemo(() => {
    return clsx(_CLASSES.NEWCONTRACT.MAIN);
  }, []);

  const getAddNewContractClassNames = useMemo(() => {
    return clsx(_CLASSES.NEWCONTRACT.ADDNEW);
  }, []);

  const getProgressClassNames = useMemo(() => {
    return clsx(_CLASSES.NEWCONTRACT.PROGRESS);
  }, []);

  const getFormClassNames = useMemo(() => {
    return clsx(_CLASSES.NEWCONTRACT.FORM);
  }, []);

  const getHeaderTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.NEWCONTRACT.HEADER);
  }, []);

  const getCloseButtonIconClassNames = useMemo(() => {
    return clsx(_CLASSES.NEWCONTRACT.CLOSEBUTTON.ICON);
  }, []);

  const renderPageTitle = useMemo(() => {
    const collection = [
      {
        label: 'Dashboard >',
        path: ROUTES.HOME.path,
      },
      {
        label: 'Contracten >',
        path: ROUTES.CONTRACTOVERVIEW.path,
      },
      {
        label: 'Nieuw Contract maken',
      },
    ];
    return (
      <AcPageTitle title={'Nieuw contract maken'} collection={collection} />
    );
  }, []);

  const closeNewForm = () => {
    const redirect = ROUTES.CONTRACTOVERVIEW.path;
    history.push(redirect);
  };

  const getCloseButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      variant: VARIANTS.OUTLINE,
      loading: is_loading,
      title: 'Afbreken',
      callback: closeNewForm,
    };
  }, [is_loading]);

  const renderNewContractPage = useMemo(() => {
    return (
      <div className={getNewContractClassNames}>
        <div className={getHeaderTitleClassNames}>
          {renderPageTitle}
          <AcButton {...getCloseButtonOptions}>
            <span>
              <AcIcon
                icon={ICONS.CLOSE}
                className={getCloseButtonIconClassNames}
              />
              Afbreken
            </span>
          </AcButton>
        </div>

        <div className={getAddNewContractClassNames}>
          <div className={getProgressClassNames}>
            <AcProgressSidebar navigation={navigation} />
          </div>
          <div className={getFormClassNames}>
            <AcForm navigation={navigation} />
          </div>
        </div>
      </div>
    );
  });

  return <div className={getMainClassNames}>{renderNewContractPage}</div>;
};

export default withStore(observer(AcContractNew));
