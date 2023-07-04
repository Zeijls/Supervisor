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

// Imports => Molecules
import AcSlaInfo from '@molecules/ac-sla-info/ac-sla-info';
import AcFormContractUpdate from '@molecules/ac-form/ac-form-contract-update.js';

// Imports => Atoms
import AcContractInfo from '@atoms/ac-contract-info/ac-contract-info';
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  INFOCARD: {
    MAIN: 'ac-infoCard',
    HEADER: 'ac-infoCard__header',
    TITLE: 'ac-infoCard__title',
    BODY: 'ac-infoCard__body',
    ICON: 'ac-client-card__icon',
  },
  MODAL: {
    CONTENT: 'ac-contract-card-modal',
  },
};

const AcContractInfoCard = ({ fields, id, store }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getInfoCardClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.MAIN);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.TITLE);
  }, []);

  const getHeaderClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.HEADER);
  }, []);

  const getBodyClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.BODY);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.ICON);
  }, []);

  const getModalClassNames = useMemo(() => {
    return clsx(_CLASSES.MODAL.CONTENT);
  }, []);

  const updateSubmit = async (data, id) => {
    console.log('contract id', id);
    await store.contracts.update(data, id);
    await store.contracts.show(id);
    store.ui.reset('modal');
  };

  const handleUpdate = async () => {
    const { current_contract } = store.contracts;

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <div className={getModalClassNames}>
            <AcFormContractUpdate
              onSubmit={updateSubmit}
              current_contract={current_contract}
              matchId={id}
              is_loading={is_loading}
            />
          </div>
        ),
        closeable: true,
        visible: true,
        callback: () => {
          store.ui.reset('modal');
        },
        actions: [],
      });
    });
  };

  const getUpdateButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'Bewerken',
      callback: handleUpdate,
    };
  }, []);

  const renderContractCard = useMemo(() => {
    return (
      <div className={getInfoCardClassNames}>
        <div className={getHeaderClassNames}>
          <h1 className={getTitleClassNames}>
            <AcIcon icon={ICONS.LAYERS} className={getIconClassNames} />{' '}
            Contractgegevens
          </h1>
          <AcButton {...getUpdateButtonOptions}>
            <AcIcon icon={ICONS.PENCIL} />
          </AcButton>
        </div>
        <div className={getBodyClassNames}>
          <AcContractInfo fields={fields} />
          <AcSlaInfo fields={fields} />
        </div>
      </div>
    );
  }, [fields]);

  return <div>{renderContractCard}</div>;
};

export default withRouter(withStore(observer(AcContractInfoCard)));
