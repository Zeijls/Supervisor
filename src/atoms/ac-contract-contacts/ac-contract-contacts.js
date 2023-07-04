// // Imports => React
import React, { useMemo } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Constants
import { THEMES, ICONS, KEYS } from '@constants';

import AcFormContactUpdate from '@molecules/ac-form/ac-form-contact-update.js';

// Import => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
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
    CARD: 'ac-infoCard-block__card',
    SELECT: 'ac-form__select',
    OPTION: 'ac-form__option',
    CIRCLE: 'ac-application-card__circle',
    ICON: 'ac-application-card__icon',
  },

  MODAL: {
    CONTENT: 'ac-contract-card-modal',
  },
};

const AcContractContacts = ({ match, fields, store }) => {
  const { id } = match.params;
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

  const getCircleClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.CIRCLE);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.ICON);
  }, []);

  const getModalClassNames = useMemo(() => {
    return clsx(_CLASSES.MODAL.CONTENT);
  }, []);

  const handleSubmit = (data, id) => {
    console.log('hier kom ik - submit');
    // await store.contacts.store(data, id);
    // store.ui.reset('modal');
  };

  const handleDelete = (id) => {
    console.log('hier kom ik - delete');
    //   await store.contacts.store(data, id);
    //   store.ui.reset('modal');
  };

  const handleNewContact = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <div className={getModalClassNames}>
            <AcFormContactUpdate
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              id={id}
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

  const getLinkButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'Contact aanmaken',
      callback: handleNewContact,
    };
  }, []);

  const checkContacts = () => {
    if (fields && fields.contacts[0]) {
      return (
        <div className={getBlockClassNames}>
          <div className={getInfoBlockClassNames}>
            <div className={getInfoItemClassNames}>
              <h4 className={getLabelClassNames}>Naam </h4>
              <h4 className={getLabelClassNames}>Email </h4>
              <h4 className={getLabelClassNames}>Telefoonnummer </h4>
              <h4 className={getLabelClassNames}>Functie </h4>
            </div>

            <div className={getInfoItemClassNames}>
              <p className={getParagraphClassNames}>
                {fields.contacts[0].name}
              </p>
              <p className={getParagraphClassNames}>
                {fields.contacts[0].email}
              </p>
              <p className={getParagraphClassNames}>
                {fields.contacts[0].phone}
              </p>
              <p className={getParagraphClassNames}>
                {fields.contacts[0].function}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderNewContactButton = () => {
    return (
      <div className={getBlockClassNames}>
        <div className={getInfoItemClassNames}>
          <AcButton {...getLinkButtonOptions}>
            <div className={getCircleClassNames}>
              <AcIcon icon={ICONS.ADD} className={getIconClassNames} />
            </div>
            Contactpersoon toevoegen
          </AcButton>
        </div>
      </div>
    );
  };

  const renderContactInfo = useMemo(() => {
    if (!checkContacts()) {
      return renderNewContactButton();
    } else {
      return checkContacts();
    }
  }, [fields, id]);

  const renderContacts = useMemo(() => {
    return <div>{renderContactInfo}</div>;
  });

  return <div>{renderContacts}</div>;
};

export default withRouter(withStore(observer(AcContractContacts)));
