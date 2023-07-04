// Imports => React
import React, { useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { THEMES, ICONS, KEYS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Import Molecules
import AcFormClientUpdate from '@molecules/ac-form/ac-form-client-update';

// Import => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcUpdatebutton from '@atoms/ac-updatebutton/ac-updatebutton';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  BLOCK: {
    MAIN: 'ac-infoCard-block',
    HEADER: 'ac-infoCard-block__header',
    TITLE: 'ac-infoCard-block__title',
    INFOBLOCK: 'ac-infoCard-block__infoblock',
    ITEM: 'ac-infoCard-block__item',
    LABEL: 'ac-infoCard-block__label',
    PARAGRAPH: 'ac-infoCard-block__paragraph',
    BODY: 'ac-client-card__body',
  },
  CIRCLE: 'ac-application-card__circle',
  ICON: 'ac-application-card__icon',
  MODAL: {
    CONTENT: 'ac-contract-card-modal',
  },
};

const AcContractClients = ({ fields, id, store, current_client }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.MAIN);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.TITLE);
  }, []);

  const getInfoBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.INFOBLOCK);
  }, []);

  const getInfoItemClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.ITEM);
  }, []);

  const getLabelClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.LABEL);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.PARAGRAPH);
  }, []);

  const getBodyClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.BODY);
  }, []);

  const getCircleClassNames = useMemo(() => {
    return clsx(_CLASSES.CIRCLE);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.ICON);
  }, []);

  const getModalClassNames = useMemo(() => {
    return clsx(_CLASSES.MODAL.CONTENT);
  }, []);

  const handleSubmit = async (data) => {
    const { current_contract } = store.contracts;

    if (current_contract && current_contract.id) {
      const { id } = current_contract;
      await store.clients.store(data);
      await attachContract();
      await store.contracts.show(id);
      store.ui.reset('modal');
    } else return null;
  };

  const attachContract = () => {
    const { new_client_id } = store.clients;
    const { current_contract } = store.contracts;

    if (current_contract) {
      const data = {
        client_id: new_client_id,
        name: current_contract.name,
        starts_at: current_contract.starts_at,
        ends_at: current_contract.ends_at,
        costs: current_contract.costs,
        hours: current_contract.hours,
      };
      store.contracts.update(data, id);
    } else return null;
  };

  const newClient = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <div className={getModalClassNames}>
            <AcFormClientUpdate
              onSubmit={handleSubmit}
              onDelete={handleDelete}
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

  const handleDelete = async (id) => {
    await store.clients.delete(id);
    store.ui.reset('modal');
  };

  const getNewButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'Klant aanmaken',
      callback: newClient,
    };
  }, []);

  const checkClients = useMemo(() => {
    if (fields && fields.client) {
      return (
        <div className={getBlockClassNames}>
          <div className={getInfoBlockClassNames}>
            <div className={getInfoItemClassNames}>
              <h4 className={getLabelClassNames}>Naam</h4>
              <h4 className={getLabelClassNames}>Email </h4>
              <h4 className={getLabelClassNames}>ID </h4>
              <h4 className={getLabelClassNames}>Straat </h4>
              <h4 className={getLabelClassNames}>Stad </h4>
              <h4 className={getLabelClassNames}>Postcode </h4>
            </div>

            <div className={getInfoItemClassNames}>
              <p className={getParagraphClassNames}>{fields.client.name}</p>
              <p className={getParagraphClassNames}>{fields.client.email}</p>
              <p className={getParagraphClassNames}>{fields.client.id}</p>
              <p className={getParagraphClassNames}>{fields.client.street}</p>
              <p className={getParagraphClassNames}>{fields.client.city}</p>
              <p className={getParagraphClassNames}>
                {fields.client.postal_code}
              </p>
            </div>
          </div>
        </div>
      );
    } else if (current_client) {
      return (
        <div className={getBlockClassNames}>
          <div className={getInfoBlockClassNames}>
            <div className={getInfoItemClassNames}>
              <h4 className={getLabelClassNames}>Naam</h4>
              <h4 className={getLabelClassNames}>Email </h4>
              <h4 className={getLabelClassNames}>ID </h4>
              <h4 className={getLabelClassNames}>Straat </h4>
              <h4 className={getLabelClassNames}>Stad </h4>
              <h4 className={getLabelClassNames}>Postcode </h4>
            </div>

            <div className={getInfoItemClassNames}>
              <p className={getParagraphClassNames}>{current_client.name}</p>
              <p className={getParagraphClassNames}>{current_client.email}</p>
              <p className={getParagraphClassNames}>{current_client.id}</p>
              <p className={getParagraphClassNames}>{current_client.street}</p>
              <p className={getParagraphClassNames}>{current_client.city}</p>
              <p className={getParagraphClassNames}>
                {current_client.postal_code}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }, [fields, current_client]);

  const renderClients = useMemo(() => {
    if (!checkClients) {
      return (
        <div className={getBlockClassNames}>
          <h5 className={getTitleClassNames}>Er is nog geen klant gekoppelt</h5>
          <div className={getInfoItemClassNames}>
            <AcButton {...getNewButtonOptions}>
              <div className={getCircleClassNames}>
                <AcIcon icon={ICONS.ADD} className={getIconClassNames} />
              </div>
              Klant toevoegen
            </AcButton>
          </div>
        </div>
      );
    } else {
      return checkClients;
    }
  }, [fields, id, current_client]);

  return <div className={getBodyClassNames}>{renderClients}</div>;
};

export default withRouter(withStore(observer(AcContractClients)));
