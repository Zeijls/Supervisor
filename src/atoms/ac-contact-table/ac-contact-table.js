// Imports => React
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, COLUMNS, KEYS, THEMES, ICONS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Hooks
import { useOverviewActions } from '@hooks';

// Imports => Components
import AcTable from '@components/ac-table/ac-table.web';

// Imports => Molecules
import AcFormContactUpdate from '@molecules/ac-form/ac-form-contact-update.js';
import AcFormContactNew from '@molecules/ac-form/ac-form-contact-new.js';

// Imports => Atoms
import AcPageTitle from '@atoms/ac-page-title/ac-page-title';
import AcSearchBar from '@atoms/ac-search-bar/ac-search-bar';
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-home ac-page',
  CONTACT: {
    TABLE: 'ac-contact-table',
  },

  INFOCARD: {
    APP: 'ac-infoCard__app',
    TITLE: 'ac-infoCard__title',
    SPAN: 'ac-render-detail__span',
  },
  BLOCK: {
    MAIN: 'ac-application-card',
    APPLICATIONBLOCK: 'ac-application-card__application-block',
    BODY: 'ac-application-card__body',
    CIRCLE: 'ac-application-card__circle',
    ICON: 'ac-application-card__icon',
  },
};

const AcContactTable = ({ store, current_client }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();
  const { handlePagination, handleSort, handleSearch } = useOverviewActions(
    store.contacts
  );

  const { contact_data } = store.contacts;

  useEffect(() => {
    store.contacts.index();
  }, [current_client]);

  const getContactTableClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTACT.TABLE);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.TITLE);
  }, []);

  const getSpanClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.SPAN);
  }, []);

  const getCircleClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.CIRCLE);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.ICON);
  }, []);

  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.MAIN);
  }, []);

  const getApplicationBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.APPLICATIONBLOCK);
  }, []);

  const getBodyClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.BODY);
  }, []);

  const handleUpdate = async (data, contact_id) => {
    const client_id = current_client.id;
    await store.contacts.update(data, contact_id);
    await store.clients.show(client_id);
    store.ui.reset('modal');
  };

  const handleSubmit = async (data, id) => {
    const { current_client } = store.clients;
    const client_id = current_client.id;
    await store.contacts.store(data);
    await store.clients.show(client_id);
    store.ui.reset('modal');
  };

  const handleDelete = async (contact_id) => {
    const client_id = current_client.id;
    await store.contacts.delete(contact_id);
    await store.clients.show(client_id);
    store.ui.reset('modal');
  };

  const handleContact = async (id, event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    await store.contacts.show(id);
    const { current_contact } = store.contacts;

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <AcFormContactUpdate
            onSubmit={handleUpdate}
            onDelete={handleDelete}
            fields={current_contact}
            id={id}
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

  const handleNewContact = async (id, event) => {
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <AcFormContactUpdate
            onSubmit={handleSubmit}
            id={id}
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

  const getLinkButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'Nieuw Contract',
      callback: handleNewContact,
    };
  }, []);

  const renderAddNewContactButton = useMemo(() => {
    if (current_client && current_client.contacts[0]) {
      return null;
    } else {
      return (
        <div className={getBlockClassNames}>
          <div className={getBodyClassNames}>
            <AcButton {...getLinkButtonOptions}>
              <div className={getCircleClassNames}>
                <AcIcon icon={ICONS.ADD} className={getIconClassNames} />
              </div>
              Voeg Contact toe
            </AcButton>
          </div>
        </div>
      );
    }
  });

  const checkContactCount = () => {
    if (current_client && current_client.contacts) {
      const current_contacts = current_client.contacts;
      const contactLength = current_contacts.length;
      return contactLength;
    } else {
      return 0;
    }
  };

  const renderHeader = useMemo(() => {
    return (
      <div>
        <h5 className={getTitleClassNames}>
          Contacten
          <span className={getSpanClassNames}>{checkContactCount()}</span>
        </h5>
        {renderAddNewContactButton}
      </div>
    );
  });

  const renderContactTable = useMemo(() => {
    if (current_client && current_client.contacts) {
      const data = current_client.contacts;
      store.contacts.setTableData(data);
      if (store.contacts.is_loading) return <AcLoader loading={true} />;
      if (!data) return null;

      if (!data || data.length === 0) return null;
      const options = {
        columns: COLUMNS.CONTACTS,
        rows: store.contacts.table_data,
        pagination: null,
        sortby: store.contacts.current_order_by,
        onSort: handleSort,
        onRowClick: (object) => {
          if (!object) return;
          const { id } = object;
          console.log('id table', id);
          handleContact(id);
        },
      };
      return <AcTable {...options} />;
    }
  }, [
    current_client,
    store.contacts.is_loading,
    store.contacts.current_order_by,
  ]);

  return (
    <div className={getContactTableClassNames}>
      {renderHeader}
      {renderContactTable}
    </div>
  );
};

export default withStore(observer(AcContactTable));
