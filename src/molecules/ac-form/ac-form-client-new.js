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
    LABEL: 'ac-form__label',
    INPUT: 'ac-form__input',
    NEXT: 'ac-form__next',
    NEXTONE: 'ac-form__next-one',
    ADRESS: 'ac-form__adress',
    CITY: 'ac-form__city',
    FORMICON: {
      NEXT: 'ac-form__icon--next',
      BACK: 'ac-form__icon--back',
    },
  },
};

export const AcFormClientNew = ({ store, navigation, onSubmit }) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [postal_code, setPostal_code] = useState('');
  const [street, setStreet] = useState('');
  const [street_number, setStreet_number] = useState('');
  const [street_number_addition, setStreet_number_addition] = useState('');
  const [city, setCity] = useState('');
  const [chamber_of_commerce, setChamber_of_commerce] = useState('');
  const [errors, setErrors] = useState({
    [KEYS.NAME]: undefined,
    [KEYS.EMAIL]: undefined,
    [KEYS.POSTAL_CODE]: undefined,
    [KEYS.STREET]: undefined,
    [KEYS.STREET_NUMBER]: undefined,
    [KEYS.CITY]: undefined,
    [KEYS.CHAMBER_OF_COMMERCE]: undefined,
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

  const getAdressClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.ADRESS);
  }, []);

  const getCityClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.CITY);
  }, []);

  const getNextButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.NEXT);
  }, []);

  const getFormNextIconClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FORMICON.NEXT);
  }, []);

  const handlePrevious = async () => {
    await store.contracts.setStepOne();
    navigation.go('AcFormClientItems');
  };

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

      case KEYS.POSTAL_CODE:
        setPostal_code(value);
        break;

      case KEYS.STREET:
        setStreet(value);
        break;

      case KEYS.STREET_NUMBER:
        setStreet_number(value);
        break;

      case KEYS.CITY:
        setCity(value);
        break;

      case KEYS.CHAMBER_OF_COMMERCE:
        setChamber_of_commerce(value);
        break;
    }
  };

  const hasErrors = useMemo(() => {
    const result =
      !AcIsNull(errors[KEYS.NAME]) ||
      !AcIsNull(errors[KEYS.EMAIL]) ||
      !AcIsNull(errors[KEYS.POSTAL_CODE]) ||
      !AcIsNull(errors[KEYS.STREET]) ||
      !AcIsNull(errors[KEYS.STREET_NUMBER]) ||
      !AcIsNull(errors[KEYS.CITY]) ||
      !AcIsNull(errors[KEYS.CHAMBER_OF_COMMERCE]);
    return result;
  }, [
    name,
    email,
    postal_code,
    street,
    street_number,
    street_number_addition,
    city,
    chamber_of_commerce,
    errors,
  ]);

  const handleSubmit = useCallback(
    (event) => {
      if (event && event.preventDefault) event.preventDefault();
      if (hasErrors) return;

      const data = {
        name,
        email,
        postal_code,
        street,
        street_number,
        street_number_addition,
        city,
        chamber_of_commerce,
      };

      if (onSubmit) onSubmit(data);
    },
    [name, email, street, street_number, city, chamber_of_commerce, hasErrors]
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

      case KEYS.POSTAL_CODE:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.STREET:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.STREET_NUMBER:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else if (!AcIsEmptyString(value) && !AcIsNumeric(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.CITY:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.CHAMBER_OF_COMMERCE:
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
  }, [handleInputChange, is_loading]);

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

  const getNameInputOptions = useMemo(() => {
    return {
      label: 'Naam',
      name: KEYS.NAME,
      value: name,
    };
  }, [name, is_loading, handleInputValidation]);

  const getEmailInputOptions = useMemo(() => {
    return {
      label: 'Email adres',
      name: KEYS.EMAIL,
      value: email,
    };
  }, [email, is_loading, handleInputValidation]);

  const getPostalCodeInputOptions = useMemo(() => {
    return {
      label: 'Postcode',
      name: KEYS.POSTAL_CODE,
      value: postal_code,
    };
  }, [postal_code, is_loading, handleInputValidation]);

  const getStreetInputOptions = useMemo(() => {
    return {
      label: 'Straatnaam',
      name: KEYS.STREET,
      value: street,
    };
  }, [street, is_loading, handleInputValidation]);

  const getNumberInputOptions = useMemo(() => {
    return {
      label: 'Nummer',
      name: KEYS.STREET_NUMBER,
      value: street_number,
    };
  }, [street_number, is_loading, handleInputValidation]);

  const getCityInputOptions = useMemo(() => {
    return {
      label: 'Stad',
      name: KEYS.CITY,
      value: city,
    };
  }, [city, is_loading, handleInputValidation]);

  const getChamberInputOptions = useMemo(() => {
    return {
      label: 'Kamer van Koophandel',
      name: KEYS.CHAMBER_OF_COMMERCE,
      value: chamber_of_commerce,
    };
  }, [chamber_of_commerce, is_loading, handleInputValidation]);

  const renderClientForm = () => {
    return (
      <div className={getFormContainerClassNames}>
        <form className={getFormClassNames} onSubmit={handleSubmit}>
          <h3 className={getTitleClassNames}>Klantrelatie</h3>
          <fieldset className={getFieldsetClassNames}>
            <legend>Contactgegevens</legend>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getNameInputOptions} />
            </label>

            <label className={getLabelClassNames}>
              <AcTextInput {...getEmailInputOptions} {...getInputOptions} />
            </label>
            <div className={getAdressClassNames}>
              <label className={getLabelClassNames}>
                <AcTextInput {...getInputOptions} {...getStreetInputOptions} />
              </label>
              <label className={getLabelClassNames}>
                <AcTextInput {...getInputOptions} {...getNumberInputOptions} />
              </label>
            </div>
            <div className={getCityClassNames}>
              <label className={getLabelClassNames}>
                <AcTextInput
                  {...getInputOptions}
                  {...getPostalCodeInputOptions}
                />
              </label>

              <label className={getLabelClassNames}>
                <AcTextInput {...getInputOptions} {...getCityInputOptions} />
              </label>
            </div>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getChamberInputOptions} />
            </label>
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

  return renderClientForm();
};

export default withRouter(withStore(observer(AcFormClientNew)));
