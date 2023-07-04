// Imports => React
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { THEMES, ICONS, TYPES, KEYS } from '@constants';

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
import AcTextInput from '@atoms/ac-text-input/ac-text-input';
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  FORM: {
    MAIN: 'ac-form',
    FORM: 'ac-form__form',
    TITLE: 'ac-form__title',
    FIELDSET: 'ac-form__fieldset',
    FUNCTION: 'ac-form__function',
    NEXT: 'ac-form__next',
    FORMICON: {
      NEXT: 'ac-form__icon--next',
    },
  },
};

export const AcFormContactNew = ({ store, navigation, onSubmit }) => {
  const button_id = AcUUID();
  const { is_loading } = store.auth;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [functie, setFunctie] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState({
    [KEYS.NAME]: undefined,
    [KEYS.EMAIL]: undefined,
    [KEYS.PHONE]: undefined,
    [KEYS.FUNCTION]: undefined,
    [KEYS.COMPANY]: undefined,
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

  const getFunctionClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FUNCTION);
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

      case KEYS.EMAIL:
        setEmail(value);
        break;

      case KEYS.PHONE:
        setPhone(value);
        break;

      case KEYS.FUNCTION:
        setFunctie(value);
        break;

      case KEYS.COMPANY:
        setCompany(value);
        break;
    }
  };

  const hasErrors = useMemo(() => {
    const result =
      !AcIsNull(errors[KEYS.NAME]) ||
      !AcIsNull(errors[KEYS.EMAIL]) ||
      !AcIsNull(errors[KEYS.PHONE]) ||
      !AcIsNull(errors[KEYS.FUNCTION]) ||
      !AcIsNull(errors[KEYS.COMPANY]);
    console.log(errors, 'errors');
    return result;
  }, [name, email, phone, functie, company, errors]);

  const handleSubmit = useCallback(
    (event) => {
      if (event && event.preventDefault) event.preventDefault();
      if (hasErrors) return;

      const data = {
        name,
        email,
        phone,
        function: functie,
        company,
      };

      if (onSubmit) onSubmit(data);
    },
    [name, email, phone, functie, company, hasErrors]
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

      case KEYS.EMAIL:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else if (!AcIsEmptyString(value) && !AcIsEmail(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.PHONE:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.FUNCTION:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.COMPANY:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
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

  const getInputOptions = useMemo(() => {
    return {
      type: TYPES.TEXT,
      required: true,
      type: 'text',
      disabled: is_loading,
      validation: handleInputValidation,
      callback: handleInputChange,
    };
  }, [is_loading, handleInputValidation, hasErrors, handleSubmit]);

  const getNameInputOptions = useMemo(() => {
    return {
      label: 'Naam',
      name: KEYS.NAME,
      value: name,
    };
  }, [name, is_loading, handleInputValidation]);

  const getEmailInputOptions = useMemo(() => {
    return {
      label: 'Email',
      name: KEYS.EMAIL,
      value: email,
    };
  }, [email, is_loading, handleInputValidation]);

  const getPhoneInputOptions = useMemo(() => {
    return {
      label: 'Telefoonnummer',
      name: KEYS.PHONE,
      value: phone,
    };
  }, [phone, is_loading, handleInputValidation]);

  const getFunctionInputOptions = useMemo(() => {
    return {
      label: 'Functie',
      name: KEYS.FUNCTION,
      value: functie,
    };
  }, [functie, is_loading, handleInputValidation]);

  const getCompanyInputOptions = useMemo(() => {
    return {
      label: 'Bedrijf',
      name: KEYS.COMPANY,
      value: company,
    };
  }, [company, is_loading, handleInputValidation]);

  const handlePrevious = async () => {
    await store.contracts.setStepOne();
    navigation.go('AcFormClientItems');
  };

  const getAddButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Volgende stap',
      disabled: hasErrors || is_loading,
      callback: handleSubmit,
    };
  }, [is_loading, handleInputValidation, hasErrors, handleSubmit]);

  const renderContactForm = () => {
    return (
      <div className={getFormContainerClassNames}>
        <form className={getFormClassNames} onSubmit={onSubmit}>
          <h3 className={getTitleClassNames}>Contactpersonen</h3>
          <fieldset className={getFieldsetClassNames}>
            <legend>Contactgegevens</legend>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getNameInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getEmailInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getPhoneInputOptions} />
            </label>
            <div className={getFunctionClassNames}>
              <label className={getLabelClassNames}>
                <AcTextInput
                  {...getInputOptions}
                  {...getFunctionInputOptions}
                />
              </label>
              <label className={getLabelClassNames}>
                <AcTextInput {...getInputOptions} {...getCompanyInputOptions} />
              </label>
            </div>
          </fieldset>
        </form>
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
      </div>
    );
  };

  return renderContactForm();
};

export default withRouter(withStore(observer(AcFormContactNew)));
