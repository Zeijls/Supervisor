// Imports => React
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, ICONS, TYPES, KEYS } from '@constants';

// Imports => Utilities
import {
  AcUUID,
  AcIsSet,
  AcIsNull,
  AcIsEmptyString,
  AcIsNumeric,
  AcIsEmail,
} from '@utils';

// Imports => Molecules
import AcPrevStep from '@molecules/ac-form/ac-prev-step.js';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcTextInput from '@atoms/ac-text-input/ac-text-input';
import AcIcon from '@atoms/ac-icon/ac-icon.web';
import AcNextStep from '@molecules/ac-form/ac-next-step.js';

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
      ADDCONTACT: 'ac-buttons__addContact',
    },
    NEXT: 'ac-form__next',
    FORMICON: {
      NEXT: 'ac-form__icon--next',
      BACK: 'ac-form__icon--back',
    },
  },
};

export const AcFormContractNew = ({
  onSubmit,
  withFormButtons = true,
  withContractForm = true,
  store,
  navigation,
}) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const [name, setName] = useState();
  const [starts_at, setStarts_at] = useState('');
  const [ends_at, setEnds_at] = useState('');
  const [hours, setHours] = useState('');
  const [costs, setCosts] = useState('');
  const [errors, setErrors] = useState({
    [KEYS.NAME]: undefined,
    [KEYS.STARTS_AT]: undefined,
    [KEYS.ENDS_AT]: undefined,
    [KEYS.HOURS]: undefined,
    [KEYS.COSTS]: undefined,
  });

  const getFormContainerClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.MAIN);
  }, []);

  const getFormClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FORM);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.TITLE);
  }, []);

  const getFieldsetClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FIELDSET);
  }, []);

  const getLabelClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.LABEL);
  }, []);

  const getNextButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.NEXT);
  }, []);

  const getFormNextIconClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FORMICON.NEXT);
  }, []);

  const handleInputChange = (event) => {
    if (event && event.persist) event.persist();
    const { value, name } = event.target;

    switch (name) {
      case KEYS.NAME:
        setName(value);
        break;

      case KEYS.STARTS_AT:
        setStarts_at(value);
        break;

      case KEYS.ENDS_AT:
        setEnds_at(value);
        break;

      case KEYS.HOURS:
        setHours(value);

      case KEYS.COSTS:
        setCosts(value);
    }
  };

  const hasErrors = useMemo(() => {
    const result =
      !AcIsNull(errors[KEYS.NAME]) ||
      !AcIsNull(errors[KEYS.STARTS_AT]) ||
      !AcIsNull(errors[KEYS.ENDS_AT]) ||
      !AcIsNull(errors[KEYS.HOURS]) ||
      !AcIsNull(errors[KEYS.COSTS]);
    return result;
  }, [name, starts_at, ends_at, hours, costs]);

  const checkClientId = () => {
    const { new_client_id } = store.clients;
    const { chosen_client_id } = store.clients;
    console.l;

    if (new_client_id) {
      const id = new_client_id;
      return id;
    }
    if (chosen_client_id) {
      const id = chosen_client_id;
      return id;
    }
  };

  const handleSubmit = useCallback(
    (event) => {
      if (event && event.prventDefault) event.prventDefault();

      const client_id = checkClientId();
      const data = {
        client_id: client_id,
        name,
        starts_at,
        ends_at,
        hours,
        costs,
      };

      if (onSubmit) onSubmit(data, client_id);
    },
    [name, starts_at, ends_at, hours, costs, hasErrors]
  );

  const handleInputValidation = useCallback((name, value, type) => {
    let result = errors;

    switch (name) {
      case KEYS.NAME:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.STARTS_AT:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.ENDS_AT:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.HOURS:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else if (!AcIsEmptyString(value) && !AcIsNumeric(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.COSTS:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else if (!AcIsEmptyString(value) && !AcIsNumeric(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      default:
    }

    setErrors(result);

    return result[name];
  }, []);

  const handlePrevious = async () => {
    await store.contracts.setStepTwo();
    navigation.go('AcFormContactItems');
  };

  const getInputOptions = useMemo(() => {
    return {
      type: TYPES.TEXT,
      required: true,
      type: 'text',
      disabled: is_loading,
      validation: handleInputValidation,
      callback: handleInputChange,
    };
  }, [handleInputChange, is_loading]);

  const getNameInputOptions = useMemo(() => {
    return {
      label: 'Klantnaam',
      name: KEYS.NAME,
      value: name,
    };
  }, [name, handleInputChange, is_loading]);

  const getStartsInputOptions = useMemo(() => {
    return {
      label: 'Opgesteld',
      name: KEYS.STARTS_AT,
      value: starts_at,
    };
  }, [starts_at, handleInputChange, is_loading]);

  const getEndsInputOptions = useMemo(() => {
    return {
      label: 'Loopt af',
      name: KEYS.ENDS_AT,
      value: ends_at,
    };
  }, [ends_at, handleInputChange, is_loading]);

  const getHoursInputOptions = useMemo(() => {
    return {
      label: 'Uren',
      name: KEYS.HOURS,
      value: hours,
    };
  }, [hours, handleInputChange, is_loading]);

  const getCostsInputOptions = useMemo(() => {
    return {
      label: 'Kosten',
      name: KEYS.COSTS,
      value: costs,
    };
  }, [costs, handleInputChange, is_loading]);

  const getAddButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Contract toevoegen',
      disabled: hasErrors || is_loading,
      callback: handleSubmit,
    };
  }, [is_loading, handleInputValidation, hasErrors, handleSubmit]);

  const renderNewContractForm = useMemo(() => {
    return (
      <div className={getFormContainerClassNames}>
        <form className={getFormClassNames}>
          <h3 className={getTitleClassNames}>Nieuw Contract</h3>
          <fieldset className={getFieldsetClassNames}>
            <legend>Contract</legend>
            <label className={getLabelClassNames}>
              Klantnaam
              <AcTextInput {...getNameInputOptions} {...getInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getStartsInputOptions} {...getInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getEndsInputOptions} {...getInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getHoursInputOptions} {...getInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getCostsInputOptions} {...getInputOptions} />
            </label>
          </fieldset>
        </form>

        <label className={getNextButtonClassNames}>
          <AcPrevStep callback={handlePrevious} />
          <AcButton {...getAddButtonOptions}>
            <span>
              Contract toevoegen
              <AcIcon
                icon={ICONS.ARROW_POINT_RIGHT}
                className={getFormNextIconClassNames}
              ></AcIcon>
            </span>
          </AcButton>
        </label>
      </div>
    );
  });

  return <div>{renderNewContractForm}</div>;
};

export default withRouter(withStore(observer(AcFormContractNew)));
