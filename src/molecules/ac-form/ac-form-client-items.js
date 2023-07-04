// Imports => React
import React, { useEffect, useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Constants
import { THEMES, ICONS, TYPES, KEYS } from '@constants';

// Imports => Hooks
import { useOverviewActions } from '@hooks';

// Imports => Molecules
import AcNextStep from '@molecules/ac-form/ac-next-step.js';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';
import AcNewContractClientTable from '@atoms/ac-newContract-client-table/ac-newContract-client-table.js';
import AcUpdateButton from '@atoms/ac-updatebutton/ac-updatebutton.js';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  FORM: {
    MAIN: 'ac-form',
    FORM: 'ac-form__form',
    TITLE: 'ac-form__title',
    CLIENTS: 'ac-form__clients',
    NEXTONE: 'ac-form__next-one',
  },
  BLOCK: {
    MAIN: 'ac-new-form-info-block',
    INFOBLOCK: 'ac-new-form-info-block__infoblock',
    ITEM: 'ac-new-form-info-block__item',
    LABEL: 'ac-new-form-info-block__label',
    PARAGRAPH: 'ac-new-form-info-block__paragraph',
  },
  CIRCLE: 'ac-application-card__circle',
  ICON: 'ac-application-card__icon',
  FORMICON: {
    NEXT: 'ac-form__icon--next',
  },
};

const AcFormClientItems = ({
  store,
  navigation,
  withFormButtons = true,
  withClientForm = true,
}) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();
  const { chosen_client_id } = store.clients;
  const { handlePagination, handleSort, handleSearch } = useOverviewActions(
    store.clients
  );
  const { client_data } = store.clients;
  const { search_image } = store.clients;
  const { current_client } = store.clients;

  useEffect(() => {
    store.clients.index();
  }, [search_image]);

  const getFormContainerClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.MAIN);
  }, []);

  const getFormClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FORM);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.TITLE);
  }, []);

  const getCurrentClientsClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.CLIENTS);
  }, []);

  const getNextOneButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.NEXTONE);
  }, []);

  const getCircleClassNames = useMemo(() => {
    return clsx(_CLASSES.CIRCLE);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.ICON);
  }, []);

  // infoblock
  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.MAIN);
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

  // button
  const getFormNextIconClassNames = useMemo(() => {
    return clsx(_CLASSES.FORMICON.NEXT);
  }, []);

  const handleNewClient = () => {
    navigation.go('AcFormClientNew');
  };

  const handleSubmit = useCallback(
    (event) => {
      if (event && event.preventDefault) event.preventDefault();
      if (!chosen_client_id) return null;
      store.contracts.setStepTwo();
      return navigation.go('AcFormContactItems');
    },
    [chosen_client_id]
  );

  const handleClientClick = async (id) => {
    await store.clients.chosenClientId(id);
    await store.clients.show(id);
    await store.ui.reset('modal');
    return renderExistingClient;
  };

  const getNewClientButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'Klant aanmaken',
      callback: handleNewClient,
    };
  }, []);

  const handleExistingClient = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    console.log(client_data, 'client data');
    console.log(chosen_client_id, 'chosen client id');

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <AcNewContractClientTable
            onClick={handleClientClick}
            handlePagination={handlePagination}
            handleSort={handleSort}
            handleSearch={handleSearch}
            client_data={client_data}
            search_image={search_image}
            is_loading={is_loading}
          />
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

  const getExistingClientButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'Klant aanmaken',
      callback: handleExistingClient,
    };
  }, []);

  const renderExistingClient = useMemo(() => {
    if (chosen_client_id && current_client) {
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
            <div className={getInfoItemClassNames}>
              <AcUpdateButton onUpdate={handleExistingClient} />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <label className={getCurrentClientsClassNames}>
          Selecteer bestaande klant
          <AcButton {...getExistingClientButtonOptions}>
            <div className={getCircleClassNames}>
              <AcIcon icon={ICONS.ADD} className={getIconClassNames} />
            </div>
            Bestaande klant kiezen
          </AcButton>
        </label>
      );
    }
  }, [chosen_client_id, current_client]);

  const renderNewClientLink = useMemo(() => {
    return (
      <label className={getCurrentClientsClassNames}>
        Kun je de klant niet vinden?
        <AcButton {...getNewClientButtonOptions}>
          <div className={getCircleClassNames}>
            <AcIcon icon={ICONS.ADD} className={getIconClassNames} />
          </div>
          Nieuwe klant aanmaken
        </AcButton>
      </label>
    );
  });

  const renderClientForm = useMemo(() => {
    return (
      <form className={getFormClassNames}>
        <h1 className={getTitleClassNames}>Relatie</h1>
        {renderExistingClient}
        {renderNewClientLink}
      </form>
    );
  }, [chosen_client_id, current_client]);

  const getAddButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Volgende stap',
      disabled: !chosen_client_id || is_loading,
      callback: handleSubmit,
    };
  }, [chosen_client_id, is_loading]);

  const renderFormButtons = useMemo(() => {
    return (
      <label className={getNextOneButtonClassNames}>
        <AcButton {...getAddButtonOptions}>
          <span>
            Volgende stap
            <AcIcon
              icon={ICONS.ARROW_POINT_RIGHT}
              className={getFormNextIconClassNames}
            ></AcIcon>
          </span>
        </AcButton>
      </label>
    );
  }, [withFormButtons, chosen_client_id, current_client]);

  return (
    <div className={getFormContainerClassNames}>
      {withClientForm && renderClientForm}
      {withFormButtons && renderFormButtons}
    </div>
  );
};

export default withStore(observer(AcFormClientItems));
