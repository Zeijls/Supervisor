// Imports => React
import React, { useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, ICONS, KEYS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Molecules
import AcApplicationForm from '@molecules/ac-application-form/ac-application-form';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcUpdatebutton from '@atoms/ac-updatebutton/ac-updatebutton';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  BLOCK: {
    MAIN: 'ac-application-card',
    APPLICATIONBLOCK: 'ac-application-card__application-block',
    BODY: 'ac-application-card__body',
    ITEM: 'ac-application-card__item',
    LABEL: 'ac-application-card__label',
    PARAGRAPH: 'ac-application-card__paragraph',
    BUTTONBLOCK: 'ac-application-card__buttonblock',
    CIRCLE: 'ac-application-card__circle',
    ICON: 'ac-application-card__icon',
  },
  MODAL: {
    CONTENT: 'ac-contract-card-modal',
  },
};

const AcContractsApplication = ({ match, fields, store }) => {
  const { id } = match.params;
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.MAIN);
  }, []);

  const getApplicationBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.APPLICATIONBLOCK);
  }, []);

  const getBodyClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.BODY);
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

  const getButtonBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.BUTTONBLOCK);
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

  const handleSubmit = async (data, application_id) => {
    await store.applications.update(data, id);
    await store.applications.show(application_id);
    store.ui.reset('modal');
  };

  const handleDelete = async (application_id) => {
    await store.applications.delete(application_id);
    await store.applications.show(application_id);
    store.ui.reset('modal');
  };

  const handleAddNewApp = async (data, id) => {
    await store.applications.store(data, id);
    await store.applications.show(id);
    store.ui.reset('modal');
  };

  const handleNewApplication = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <div className={getModalClassNames}>
            <AcApplicationForm
              onSubmit={handleAddNewApp}
              onDelete={handleDelete}
              is_loading={is_loading}
              id={id}
              fields={fields}
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
      title: 'Nieuw Contract',
      callback: handleNewApplication,
    };
  }, []);

  const handleUpdate = async (number, fields, id, event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    await store.applications.show(id);
    const { current_application } = store.applications;
    const application_id = current_application.id;

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <div className={getModalClassNames}>
            <AcApplicationForm
              onSubmit={handleSubmit}
              fields={current_application}
              current_contract={fields}
              application_id={application_id}
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

  const checkApplications = useMemo(() => {
    if (fields && fields.applications) {
      let collection = fields.applications;

      const len = collection.length;
      let number = 0;
      let result = [];

      for (number; number < len; number++) {
        const item = collection[number];

        const object = (
          <div id={number} className={getBlockClassNames}>
            <div className={getBodyClassNames}>
              <div className={getApplicationBlockClassNames}>
                <div className={getInfoItemClassNames}>
                  <h4 className={getLabelClassNames}>Applicatie naam</h4>
                  <h4 className={getLabelClassNames}>Omschrijving</h4>
                  <h4 className={getLabelClassNames}>Provider</h4>
                  <h4 className={getLabelClassNames}>Repository </h4>
                </div>
                <div className={getInfoItemClassNames}>
                  <p className={getParagraphClassNames}>{item.name}</p>
                  <p className={getParagraphClassNames}>{item.description}</p>
                  <p className={getParagraphClassNames}>{item.git_provider}</p>
                  <p className={getParagraphClassNames}>{item.git_repo}</p>
                </div>
              </div>
              <div className={getButtonBlockClassNames}>
                <AcUpdatebutton
                  onSubmit={handleUpdate}
                  id={item.id}
                  number={number}
                />
              </div>
            </div>
          </div>
        );
        result.push(object);
      }
      return result;
    } else {
      return null;
    }
  }, [fields]);

  const renderAddNewApplicationButton = useMemo(() => {
    return (
      <div className={getBlockClassNames}>
        <div className={getBodyClassNames}>
          {/* <div className={getApplicationBlockClassNames}> */}
          <AcButton {...getLinkButtonOptions}>
            <div className={getCircleClassNames}>
              <AcIcon icon={ICONS.ADD} className={getIconClassNames} />
            </div>
            Voeg applicatie toe
          </AcButton>
        </div>
      </div>
      // </div>
    );
  });

  const renderApplications = useMemo(() => {
    if (!checkApplications) {
      return renderAddNewApplicationButton();
    } else {
      return checkApplications;
    }
  }, [fields, id]);

  return (
    <div>
      {renderApplications}
      {renderAddNewApplicationButton}
    </div>
  );
};

export default withRouter(withStore(observer(AcContractsApplication)));
