// Imports => React
import React, { useState, useEffect, useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, TYPES } from '@constants';

// Imports => Utilities
import {
  AcUUID,
  AcIsSet,
  AcIsUndefined,
  AcIsNull,
  AcIsArray,
  AcIsObject,
  AcIsNumeric,
  AcIsEmptyString,
  AcIsEmail,
} from '@utils';

// Imports => Molecules
import AcSlaInfo from '@molecules/ac-sla-info/ac-sla-info.js';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcRemoveButton from '@atoms/ac-remove-button/ac-remove-button';
import AcTextInput from '@atoms/ac-text-input/ac-text-input';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  FORM: {
    MAIN: 'ac-form',
    FORM: 'ac-form__form',
    TITLE: 'ac-form__title',
    FIELDSET: 'ac-form__fieldset',
    LABEL: 'ac-form__label',
    INPUT: 'ac-form__input',
    BUTTONS: {
      PRIMAIR: 'ac-buttons__primair',
      SECUNDAIR: 'ac-buttons__secundair',
      ADDCONTACT: 'ac-buttons__addContact',
      REMOVE: 'ac-buttons__remove',
    },
    NEXTONE: 'ac-form__next-one',
  },
};

export const AcFormContractNew = ({
  store,
  onSubmit,
  match,
  current_contract,
  is_loading,
  matchId,
}) => {
  const history = useHistory();
  const button_id = AcUUID();

  const [name, setName] = useState(
    (current_contract && current_contract.name) || ''
  );
  const [starts_at, setStarts_at] = useState(
    (current_contract && current_contract.starts_at) || ''
  );
  const [ends_at, setEnds_at] = useState(
    (current_contract && current_contract.ends_at) || ''
  );
  const [costs, setCosts] = useState(
    (current_contract && current_contract.costs) || ''
  );
  const [hours, setHours] = useState(
    (current_contract && current_contract.hours) || ''
  );
  const [errors, setErrors] = useState({
    name: undefined,
    starts_at: undefined,
    ends_at: undefined,
    costs: undefined,
    hours: undefined,
  });

  useEffect(() => {
    if (current_contract && current_contract.name)
      setName(current_contract.name);
    if (current_contract && current_contract.starts_at)
      setStarts_at(current_contract.starts_at);
    if (current_contract && current_contract.ends_at)
      setEnds_at(current_contract.ends_at);
    if (current_contract && current_contract.costs)
      setCosts(current_contract.costs);
    if (current_contract && current_contract.hours)
      setHours(current_contract.hours);
  }, [current_contract]);

  const getFormContainerClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.MAIN);
  }, []);

  const getFormClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FORM);
  }, []);

  const getFieldsetClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FIELDSET);
  }, []);

  const getLabelClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.LABEL);
  }, []);

  const getNextOneButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.NEXTONE);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.TITLE);
  }, []);

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    if (event && event.persist) event.persist();

    switch (name) {
      case 'name':
        setName(value);
        break;

      case 'starts_at':
        setStarts_at(value);
        break;

      case 'ends_at':
        setEnds_at(value);
        break;

      case 'costs':
        setCosts(value);
        break;

      case 'hours':
        setHours(value);
    }
  };

  const handleSubmit = (event) => {
    if (event && event.preventDefault) event.preventDefault();
    return defineClientId();
  };

  const defineClientId = () => {
    if (!current_contract && !current_contract.client) return null;

    const client_id = current_contract.client.id;
    console.log(client_id, 'client id');
    return storeData(client_id);
  };

  const storeData = async (client_id) => {
    console.log(client_id, 'client id');
    const data = {
      client_id: client_id,
      name,
      starts_at,
      ends_at,
      costs,
      hours,
    };

    console.log(matchId, 'match id');
    if (onSubmit) onSubmit(data, matchId);
  };

  const removeItem = async () => {
    const { id } = match.params;
    await store.contracts.delete(id);
    return redirectDetailPage();
  };

  const redirectDetailPage = () => {
    const redirect = ROUTES.CONTRACTOVERVIEW.path;
    history.push(redirect);
  };

  const getAddButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Nieuw Contract',
      callback: handleSubmit,
    };
  }, [name, starts_at, ends_at, hours, costs]);

  const getInputOptions = useMemo(() => {
    return {
      type: TYPES.TEXT,
      required: true,
      type: 'text',
      callback: handleInputChange,
      // validation: handleInputValidation,
    };
  });

  const getNameInputOptions = useMemo(() => {
    return {
      label: 'Gebruikersnaam',
      name: 'name',
      value: name,
    };
  }, [name]);

  const getStartInputOptions = useMemo(() => {
    return {
      label: 'Opgesteld',
      name: 'starts_at',
      value: starts_at,
    };
  }, [starts_at]);

  const getEndsInputOptions = useMemo(() => {
    return {
      label: 'Loopt af',
      name: 'ends_at',
      value: ends_at,
    };
  }, [ends_at]);

  const getHoursInputOptions = useMemo(() => {
    return {
      label: 'Uren',
      name: 'hours',
      value: hours,
    };
  }, [hours]);

  const getCostsInputOptions = useMemo(() => {
    return {
      label: 'Kosten',
      name: 'costs',
      value: costs,
    };
  }, [costs]);

  const renderContractUpdate = useMemo(() => {
    return (
      <form className={getFormClassNames}>
        <h3 className={getTitleClassNames}>Nieuw Contract</h3>
        <fieldset className={getFieldsetClassNames}>
          <legend>Contract</legend>
          <label className={getLabelClassNames}>
            <AcTextInput {...getNameInputOptions} {...getInputOptions} />
          </label>

          <label className={getLabelClassNames}>
            <AcTextInput {...getStartInputOptions} {...getInputOptions} />
          </label>
          <label className={getLabelClassNames}>
            <AcTextInput {...getEndsInputOptions} {...getInputOptions} />
          </label>
          <label className={getLabelClassNames}>
            <AcTextInput {...getCostsInputOptions} {...getInputOptions} />
          </label>
          <label className={getLabelClassNames}>
            <AcTextInput {...getHoursInputOptions} {...getInputOptions} />
          </label>
        </fieldset>
        <AcRemoveButton onSubmit={removeItem} />
        <AcButton {...getAddButtonOptions}>Wijzigingen Opslaan</AcButton>
      </form>
    );
  });

  return (
    <div className={getFormContainerClassNames}>{renderContractUpdate}</div>
  );
};

export default AcFormContractNew;
