// Imports => React
import React, { useMemo, useEffect } from 'react';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, COLUMNS, KEYS } from '@constants';

// Imports => Hooks
import { useOverviewActions } from '@hooks';

// Imports => Atoms
import AcContractCardClient from '@atoms/ac-card/ac-contract-card-client.js';
import AcCardContact from '@atoms/ac-card/ac-card-contact.js';
import AcCardContract from '@atoms/ac-card/ac-card-contract.js';
import AcClientTable from '@atoms/ac-client-table/ac-client-table.js';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  CLIENTCARD: 'ac-client-card',
};

const AcContractClientCard = ({ id, fields, store }) => {
  const { is_loading } = store.auth;
  const { handlePagination, handleSort, handleSearch } = useOverviewActions(
    store.clients
  );
  const { client_data } = store.clients;
  const { search_image } = store.clients;
  const { current_contract } = store.contracts;
  useEffect(() => {
    store.clients.index();
    store.clients.setPerPage(5);
  }, [search_image]);

  const getClientCardClassNames = useMemo(() => {
    return clsx(_CLASSES.CLIENTCARD);
  }, []);

  const checkCurrentClient = () => {
    if (fields && fields.client) {
      const current_client = fields.client;
      return current_client;
    } else return null;
  };

  const checkCurrentContact = () => {
    if (fields && fields.contacts) {
      const current_contact = fields.contacts[0];
      return current_contact;
    } else return null;
  };

  const handleClick = async (id) => {
    const contract_id = fields.id;
    await store.clients.show(id);
    const { current_client } = store.clients;

    const data = {
      name: current_client.name,
      email: current_client.email,
      postal_code: current_client.postal_code,
      street: current_client.street,
      street_number: current_client.street_number,
      street_number_addition: current_client.street_number_addition,
      city: current_client.city,
      chamber_of_commerce: current_client.chamber_of_commerce,
    };

    await store.clients.update(data, id);
    await store.contracts.show(contract_id);
    store.ui.reset('modal');
  };

  const updateClient = async (event) => {
    await store.ui.reset(KEYS.MODAL).then(() => {
      store.ui.setInstance(KEYS.MODAL, {
        body: (
          <AcClientTable
            onClick={handleClick}
            fields={fields}
            is_loading={is_loading}
            handlePagination={handlePagination}
            handleSort={handleSort}
            handleSearch={handleSearch}
            client_data={client_data}
            search_image={search_image}
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

  const renderClientCard = useMemo(() => {
    const current_client = checkCurrentClient();
    const current_contact = checkCurrentContact();
    return (
      <div className={getClientCardClassNames}>
        <AcContractCardClient
          fields={current_contract}
          current_client={current_client}
          id={id}
          onUpdate={updateClient}
        />
        <AcCardContact
          fields={current_contract}
          currentid={id}
          current_contact={current_contact}
        />
      </div>
    );
  }, [fields, current_contract]);

  return <div>{renderClientCard}</div>;
};

export default withStore(observer(AcContractClientCard));
