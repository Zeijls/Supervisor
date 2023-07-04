// Imports => React
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Utilities
import {
  AcUUID,
  AcIsSet,
  AcIsNull,
  AcIsEmptyString,
  AcIsNumeric,
  AcIsEmail,
} from '@utils';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, TYPES, KEYS } from '@constants';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcRemoveButton from '@atoms/ac-remove-button/ac-remove-button';
import AcTextInput from '@atoms/ac-text-input/ac-text-input';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  FORM: {
    MAIN: 'ac-update-form',
    FORM: 'ac-update-form__form',
    TITLE: 'ac-update-form__title',
    FIELDSET: 'ac-update-form__fieldset',
    LABEL: 'ac-update-form__label',
    INPUT: 'ac-update-form__input',
    NEXTONE: 'ac-update-form__next-one',
    FUNCTION: 'ac-update-form__function',
  },
};

export const AcFormContactUpdate = ({
  store,
  fields,
  onSubmit,
  match,
  id,
  onDelete,
  is_loading,
  current_client,
}) => {
  const history = useHistory();
  const button_id = AcUUID();

  const [name, setName] = useState((fields && fields.name) || '');
  const [email, setEmail] = useState((fields && fields.email) || '');
  const [phone, setPhone] = useState((fields && fields.phone) || '');
  const [functie, setFunctie] = useState((fields && fields.function) || '');
  const [company, setCompany] = useState((fields && fields.company) || '');
  const [errors, setErrors] = useState({
    [KEYS.NAME]: undefined,
    [KEYS.EMAIL]: undefined,
    [KEYS.PHONE]: undefined,
    [KEYS.FUNCTION]: undefined,
    [KEYS.COMPANY]: undefined,
  });

  useEffect(() => {
    if (fields && fields.name) setName(fields.name);
    if (fields && fields.email) setEmail(fields.email);
    if (fields && fields.phone) setPhone(fields.phone);
    if (fields && fields.function) setFunctie(fields.function);
    if (fields && fields.company) setCompany(fields.company);
  }, [fields]);

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

  const getNextOneButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.NEXTONE);
  }, []);

  const getFunctionClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FUNCTION);
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
      const contact_id = fields.id;

      const data = {
        name,
        email,
        phone,
        function: functie,
        company,
      };

      console.log(contact_id, 'contact id');
      if (onSubmit) onSubmit(data, contact_id);
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

  const handleDelete = (event) => {
    const contact_id = fields.id;
    if (event && event.preventDefault) event.preventDefault();
    console.log(id, 'contact id');
    if (onDelete) onDelete(contact_id);
  };

  const getAddButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: false,
      title: 'Opslaan',
      disabled: hasErrors || is_loading,
      callback: handleSubmit,
    };
  }, [is_loading, handleInputValidation, hasErrors, handleSubmit]);

  const renderContactForm = useMemo(() => {
    return (
      <div className={getFormContainerClassNames}>
        <form className={getFormClassNames}>
          <h3 className={getTitleClassNames}>Contactpersonen</h3>
          <fieldset className={getFieldsetClassNames}>
            <legend>Contactgegevens</legend>
            <label className={getLabelClassNames}>
              <AcTextInput {...getNameInputOptions} {...getInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getEmailInputOptions} {...getInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getPhoneInputOptions} {...getInputOptions} />
            </label>
            <div className={getFunctionClassNames}>
              <label className={getLabelClassNames}>
                <AcTextInput
                  {...getFunctionInputOptions}
                  {...getInputOptions}
                />
              </label>
              <label className={getLabelClassNames}>
                <AcTextInput {...getCompanyInputOptions} {...getInputOptions} />
              </label>
            </div>
          </fieldset>
          <AcButton {...getAddButtonOptions}>Wijzigingen opslaan</AcButton>
          <AcRemoveButton onSubmit={handleDelete} />
        </form>
      </div>
    );
  });

  return <div> {renderContactForm}</div>;
};

export default AcFormContactUpdate;
