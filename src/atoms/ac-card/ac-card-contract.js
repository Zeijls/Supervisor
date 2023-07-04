// Imports => React
import React, { useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, ICONS, KEYS, THEMES } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Import Molecules
import AcFormClientUpdate from '@molecules/ac-form/ac-form-client-update';
import AcModal from '@molecules/ac-modal/ac-modal.web';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  BLOCK: {
    MAIN: 'ac-infoCard-block',
  },
  DETAILCARD: {
    MAIN: 'ac-client-card',
    CARD: 'ac-client-card__card',
    HEADER: 'ac-client-card__header',
    TITLE: 'ac-client-card__title',
    BODY: 'ac-client-card__body',
    ICON: 'ac-client-card__icon',
    CONTRACT_ICON: 'ac-client-card__contract-icon',
  },
};

const AcCardContract = ({ fields, id, store, callback }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getCardClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.CARD);
  }, []);

  const getHeaderClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.HEADER);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.TITLE);
  }, []);

  const getBodyClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.BODY);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.ICON);
  }, []);

  const getIconContractClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.CONTRACT_ICON);
  }, []);

  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.MAIN);
  }, []);

  const renderHeader = useMemo(() => {
    return (
      <div className={getHeaderClassNames}>
        <h1 className={getTitleClassNames}>
          <AcIcon icon={ICONS.LAYERS} className={getIconClassNames} />
          Contractgegevens
        </h1>
      </div>
    );
  });

  const handleCallback = () => {
    const { current_client } = store.clients;
    if (current_client && current_client.contracts[0]) {
      const current_contract = current_client.contracts[0];
      const contractId = current_contract.id;
      const redirect = ROUTES.CONTRACTDETAIL.path.replace(':id?', contractId);
      history.push(redirect);
    }
  };

  const getContractLinkButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Bewerken',
      callback: handleCallback,
    };
  }, []);

  const renderContractCard = useMemo(() => {
    const { current_client } = store.clients;
    if (current_client && current_client.contracts[0]) {
      return (
        <div className={getBodyClassNames}>
          <div className={getBlockClassNames}>
            <AcButton {...getContractLinkButtonOptions}>
              Bekijk het contract
              <AcIcon
                icon={ICONS.ARROW_RIGHT}
                className={getIconContractClassNames}
              />
            </AcButton>
          </div>
        </div>
      );
    } else {
      return (
        <div className={getBodyClassNames}>
          <div className={getBlockClassNames}>
            <p> Er is geen contract gekoppeld </p>
          </div>
        </div>
      );
    }
  });

  return (
    <div className={getCardClassNames}>
      {renderHeader}
      {renderContractCard}
    </div>
  );
};

export default withRouter(withStore(observer(AcCardContract)));
