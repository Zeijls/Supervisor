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
import AcPrevStep from '@molecules/ac-form/ac-prev-step.js';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';
import AcNewContractContractContactTable from '@atoms/ac-newContract-contact-table/ac-newContract-contact-table.js';
import AcUpdateButton from '@atoms/ac-updatebutton/ac-updatebutton.js';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  FORM: {
    MAIN: 'ac-form',
    FORM: 'ac-form__form',
    TITLE: 'ac-form__title',
    CLIENTS: 'ac-form__clients',
    NEXT: 'ac-form__next',
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

export const AcFormContactItems = ({
  store,
  navigation,
  withFormButtons = true,
  withContactForm = true,
}) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();
  const { chosen_contact_id } = store.contacts;

  const { handlePagination, handleSort, handleSearch } = useOverviewActions(
    store.contacts
  );
  const { contact_data } = store.contacts;
  const { search_image } = store.clients;
  const { current_contact } = store.contacts;

  useEffect(() => {
    store.contacts.index();
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

  const getCircleClassNames = useMemo(() => {
    return clsx(_CLASSES.CIRCLE);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.ICON);
  }, []);

  const getNextButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.NEXT);
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

  const handleNewContact = () => {
    navigation.go('AcFormContactNew');
  };

  const handleSubmit = useCallback(
    (event) => {
      if (event && event.preventDefault) event.preventDefault();
      // if (!chosen_contact_id) return null;
      console.log(chosen_contact_id, 'wel chosen contact ');
      store.contracts.setStepThree();
      return navigation.go('AcFormContractNew');
    },
    [chosen_contact_id]
  );

  const handleContactClick = async (id) => {
    console.log(id, 'id');
    console.log('hier kom ik');
    await store.contacts.chosenContactId(id);
    const { chosen_contact_id } = store.contacts;
    await store.contacts.show(id);
    await store.ui.reset('modal');
    console.log(chosen_contact_id, 'chosen contact id hanld econtact');
    return renderExistingContact;
  };

  const getNewClientButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'Klant aanmaken',
      callback: handleNewContact,
    };
  }, []);

  const handlePrevious = async () => {
    await store.contracts.setStepOne();
    navigation.go('AcFormClientItems');
  };

  const handleExistingContact = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    console.log(contact_data, 'client data');
    console.log(chosen_contact_id, 'chosen client id');

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <AcNewContractContractContactTable
            onClick={handleContactClick}
            handlePagination={handlePagination}
            handleSort={handleSort}
            handleSearch={handleSearch}
            contact_data={contact_data}
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
      callback: handleExistingContact,
    };
  }, []);

  const renderExistingContact = useMemo(() => {
    console.log(chosen_contact_id, 'chosen contact id');

    if (current_contact) {
      console.log(current_contact, 'current contact');
      console.log(chosen_contact_id, 'chosen contact id');
      return (
        <div className={getBlockClassNames}>
          <div className={getInfoBlockClassNames}>
            <div className={getInfoItemClassNames}>
              <h4 className={getLabelClassNames}>Naam</h4>
              <h4 className={getLabelClassNames}>Email </h4>
              <h4 className={getLabelClassNames}>Telefoonnummer </h4>
              <h4 className={getLabelClassNames}>Functie </h4>
              <h4 className={getLabelClassNames}>Bedrijf </h4>
            </div>

            <div className={getInfoItemClassNames}>
              <p className={getParagraphClassNames}>{current_contact.name}</p>
              <p className={getParagraphClassNames}>{current_contact.email}</p>
              <p className={getParagraphClassNames}>{current_contact.phone}</p>
              <p className={getParagraphClassNames}>
                {current_contact.function}
              </p>
              <p className={getParagraphClassNames}>
                {current_contact.company}
              </p>
            </div>
            <div className={getInfoItemClassNames}>
              <AcUpdateButton onUpdate={handleExistingContact} />
            </div>
          </div>
        </div>
      );
    } else {
      console.log('geen goeie specs');
      return (
        <label className={getCurrentClientsClassNames}>
          Bestaand contactpersonen selecteren
          <AcButton {...getExistingClientButtonOptions}>
            <div className={getCircleClassNames}>
              <AcIcon icon={ICONS.ADD} className={getIconClassNames} />
            </div>
            Bestaand contactpersoon kiezen
          </AcButton>
        </label>
      );
    }
  }, [chosen_contact_id, current_contact]);

  const renderNewContactLink = useMemo(() => {
    return (
      <label className={getCurrentClientsClassNames}>
        Staat de contactpersoon niet in de lijst?
        <AcButton {...getNewClientButtonOptions}>
          <div className={getCircleClassNames}>
            <AcIcon icon={ICONS.ADD} className={getIconClassNames} />
          </div>
          Extra contactpersoon toevoegen
        </AcButton>
      </label>
    );
  });

  const renderContactForm = useMemo(() => {
    return (
      <form className={getFormClassNames}>
        <h1 className={getTitleClassNames}>Contactpersonen</h1>
        {renderExistingContact}
        {renderNewContactLink}
      </form>
    );
  });

  const getAddButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Volgende stap',
      // disabled: !chosen_contact_id || is_loading,
      disabled: is_loading,
      callback: handleSubmit,
    };
  }, [chosen_contact_id, is_loading]);

  const renderFormButtons = useMemo(() => {
    return (
      <label className={getNextButtonClassNames}>
        <AcPrevStep callback={handlePrevious} />
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
  }, [withFormButtons, chosen_contact_id, current_contact]);

  return (
    <div className={getFormContainerClassNames}>
      {withContactForm && renderContactForm}
      {withFormButtons && renderFormButtons}
    </div>
  );
};

export default withStore(observer(AcFormContactItems));
