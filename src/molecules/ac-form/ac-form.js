// Imports => React
import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import { useForm, useStep } from 'react-hooks-helper';

// Imports => Constants
import { ROUTES } from '@constants';

// Imports => Molecules
import AcFormClientNew from '@molecules/ac-form/ac-form-client-new';
import AcFormContactNew from '@molecules/ac-form/ac-form-contact-new';

import AcFormClientItems from '@molecules/ac-form/ac-form-client-items';
import AcFormContactItems from '@molecules/ac-form/ac-form-contact-items';
import AcFormContractNew from '@molecules/ac-form/ac-form-contract-new';

const defaultData = {
  name: '',
  email: '',
  postal_code: '',
  street: '',
  street_number: '',
  city: '',
  chamber_of_commerce: '',
  contractname: '',
  starts_at: '',
  ends_at: '',
  costs: '',
  hours: '',
};

const steps = [
  { id: 'AcFormClientItems' },
  { id: 'AcFormClientNew' },
  { id: 'AcFormContactItems' },
  { id: 'AcFormContactNew' },
  { id: 'AcFormContractNew' },
];

const AcForm = ({ store }) => {
  const history = useHistory();

  const { stored_client_data } = store.clients;
  const { stored_contract_data } = store.contracts;

  const [formData, setForm] = useForm(defaultData);
  const { step, navigation } = useStep({
    steps,
    initialStep: 0,
  });

  const props = {
    formData,
    setForm,
    navigation,
    stored_client_data,
    stored_contract_data,
  };

  const clientSubmit = async (data) => {
    await store.clients.store(data);
    return redirectClient();
  };

  const redirectClient = () => {
    navigation.go('AcFormContactItems');
  };

  const contactSubmit = async (data) => {
    await checkContactId(data);
    return redirectContact();
  };

  const redirectContact = () => {
    navigation.go('AcFormContractNew');
  };

  const checkContactId = (data) => {
    const { submit_contract_id } = store.contracts;
    const id = submit_contract_id;
    const { new_contact_id } = store.contacts;
    const { chosen_contact_id } = store.contacts;

    if (new_contact_id) {
      const data = { contacts: [id] };
      return store.contracts.attach(data, id);
    }

    if (chosen_contact_id) {
      const contactId = chosen_contact_id;
      const data = { contacts: [contactId] };
      return store.contracts.attach(data, id);
    } else return null;
  };

  const contractSubmit = async (data) => {
    await store.contracts.store(data);
    redirectContract();
  };

  const redirectContract = () => {
    const { submit_contract_id } = store.contracts;
    const id = submit_contract_id;
    const contractId = ROUTES.CONTRACTDETAIL.path.replace(':id?', id);
    history.push(contractId);
  };

  switch (step.id) {
    case 'AcFormClientItems':
      return <AcFormClientItems {...props} text="Volgende stap" />;
    case 'AcFormClientNew':
      return <AcFormClientNew {...props} onSubmit={clientSubmit} />;
    case 'AcFormContactItems':
      return <AcFormContactItems {...props} />;
    case 'AcFormContactNew':
      return <AcFormContactNew {...props} onSubmit={contactSubmit} />;
    case 'AcFormContractNew':
      return <AcFormContractNew {...props} onSubmit={contractSubmit} />;
  }

  return (
    <div>
      <h1>Multi step form</h1>
    </div>
  );
};

export default withRouter(withStore(observer(AcForm)));
