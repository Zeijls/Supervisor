// Imports => React
import React, { useMemo, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, ICONS, KEYS } from '@constants';

// Imports => Hooks
import { useOverviewActions } from '@hooks';

// Imports => Molecules
import AcFormContactUpdate from '@molecules/ac-form/ac-form-contact-update';
import AcModal from '@molecules/ac-modal/ac-modal.web';

// Import => Atoms
import AcUpdatebutton from '@atoms/ac-updatebutton/ac-updatebutton';
import AcContractContacts from '@atoms/ac-contract-contacts/ac-contract-contacts';
import AcIcon from '@atoms/ac-icon/ac-icon.web';
import AcContractContactTable from '@atoms/ac-card/ac-contract-contact-table.js';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  DETAILCARD: {
    CARD: 'ac-client-card__card',
    HEADER: 'ac-client-card__header',
    TITLE: 'ac-client-card__title',
    BODY: 'ac-client-card__body',
    ICON: 'ac-client-card__icon',
  },
  MODAL: {
    CONTENT: 'ac-contract-card-modal',
  },
};

const AcCardContact = ({ fields, id, store, current_contact }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const { handlePagination, handleSort, handleSearch } = useOverviewActions(
    store.contacts
  );

  const { contact_data } = store.contacts;
  const { search_image } = store.clients;

  useEffect(() => {
    store.contacts.index();
  }, [search_image]);

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

  const handleClick = async (id) => {
    const contract_id = fields.id;
    console.log('hier kom ik', id);
    await store.contacts.show(id);
    const { current_contact } = store.contacts;

    const data = {
      name: current_contact.name,
      email: current_contact.email,
      phone: current_contact.phone,
      function: current_contact.function,
      company: current_contact.company,
    };

    await store.contacts.update(data, id);
    await store.contracts.show(contract_id);
    store.ui.reset('modal');
  };

  const updateContact = async (event) => {
    console.log(contact_data, 'contact data');
    const { data } = contact_data;
    store.contacts.setTableData(data);
    const { table_data } = store.contacts;
    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <AcContractContactTable
            onClick={handleClick}
            fields={fields}
            is_loading={is_loading}
            handlePagination={handlePagination}
            handleSort={handleSort}
            handleSearch={handleSearch}
            contact_data={contact_data}
            search_image={search_image}
            table_data={table_data}
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

  const renderUpdatebutton = useMemo(() => {
    if (fields && fields.contacts) {
      return (
        <AcUpdatebutton onSubmit={updateContact} contract_id={id} id={id} />
      );
    } else return null;
  }, [fields]);

  const renderHeader = useMemo(() => {
    if (fields && fields.contacts[0]) {
      return (
        <div className={getHeaderClassNames}>
          <h1 className={getTitleClassNames}>
            <AcIcon icon={ICONS.PERSON} className={getIconClassNames} />
            Contactpersoon
          </h1>
          {renderUpdatebutton}
        </div>
      );
    } else {
      return (
        <div className={getHeaderClassNames}>
          <h1 className={getTitleClassNames}>
            <AcIcon icon={ICONS.PERSON} className={getIconClassNames} />
            Contactpersoon
          </h1>
        </div>
      );
    }
  });

  const renderBody = useMemo(() => {
    return (
      <div className={getBodyClassNames}>
        <AcContractContacts fields={fields} id={id} />
      </div>
    );
  });

  return (
    <div className={getCardClassNames}>
      {renderHeader}
      {renderBody}
    </div>
  );
};

export default withRouter(withStore(observer(AcCardContact)));
