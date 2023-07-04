// Imports => React
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, TYPES, KEYS } from '@constants';

// Imports => Utilities
import {
  AcUUID,
  AcIsSet,
  AcIsNull,
  AcIsEmptyString,
  AcIsNumeric,
  AcIsEmail,
} from '@utils';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcRemoveButton from '@atoms/ac-remove-button/ac-remove-button';
import AcTextInput from '@atoms/ac-text-input/ac-text-input';

const _CLASSES = {
  MAIN: 'ac-update-page ac-home',
  FORM: {
    MAIN: 'ac-update-form',
    UPDATECONTAINER: 'ac-update-form__container',
    FORM: 'ac-update-form__form',
    TITLE: 'ac-update-form__title',
    FIELDSET: 'ac-update-form__fieldset',
    LABEL: 'ac-update-form__label',
    INPUT: 'ac-update-form__input',
    NEXTONE: 'ac-update-form__next-one',
    ADRESS: 'ac-update-form__adress',
    CITY: 'ac-update-form__city',
  },
};

export const AcFormClientNew = ({
  current_client,
  onSubmit,
  onDelete,
  store,
  is_loading,
}) => {
  const history = useHistory();
  const button_id = AcUUID();

  const [name, setName] = useState(
    (current_client && current_client.name) || ''
  );
  const [email, setEmail] = useState(
    (current_client && current_client.email) || ''
  );
  const [postal_code, setPostal_code] = useState(
    (current_client && current_client.postal_code) || ''
  );
  const [street, setStreet] = useState(
    (current_client && current_client.street) || ''
  );
  const [street_number, setStreet_number] = useState(
    (current_client && current_client.street_number) || ''
  );
  const [street_number_addition, setStreet_number_addition] = useState(
    (current_client && current_client.street_number_addition) || ''
  );
  const [city, setCity] = useState(
    (current_client && current_client.city) || ''
  );
  const [chamber_of_commerce, setChamber_of_commerce] = useState(
    (current_client && current_client.chamber_of_commerce) || ''
  );
  const [errors, setErrors] = useState({
    [KEYS.NAME]: undefined,
    [KEYS.EMAIL]: undefined,
    [KEYS.POSTAL_CODE]: undefined,
    [KEYS.STREET]: undefined,
    [KEYS.STREET_NUMBER]: undefined,
    [KEYS.CITY]: undefined,
    [KEYS.CHAMBER_OF_COMMERCE]: undefined,
  });

  useEffect(() => {
    if (current_client && current_client.name) setName(current_client.name);
    if (current_client && current_client.email) setEmail(current_client.email);
    if (current_client && current_client.postal_code)
      setPostal_code(current_client.postal_code);
    if (current_client && current_client.street)
      setStreet(current_client.street);
    if (current_client && current_client.street_number)
      setStreet_number(current_client.street_number);
    if (current_client && current_client.street_number_addition)
      setStreet_number_addition(current_client.street_number_addition);
    if (current_client && current_client.city) setCity(current_client.city);
    if (current_client && current_client.chamber_of_commerce)
      setChamber_of_commerce(current_client.chamber_of_commerce);
  }, [current_client]);

  const getFormContainerClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.MAIN);
  }, []);

  const getFormUpdateContainerClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.UPDATECONTAINER);
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

  const getAdressClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.ADRESS);
  }, []);

  const getCityClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.CITY);
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

  const handleDelete = (event) => {
    if (event && event.preventDefault) event.preventDefault();
    const id = current_client.id;

    if (onDelete) onDelete(id);
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

  const checkRemoveButton = () => {
    console.log(current_client, 'current client');
    if (current_client) {
      console.log('hier kom ik');
      return <AcRemoveButton onSubmit={handleDelete} />;
    } else return null;
    a;
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
        <div className={getFormUpdateContainerClassNames}>
          <form className={getFormClassNames}>
            <h3 className={getTitleClassNames}>Klantrelatie</h3>
            <fieldset className={getFieldsetClassNames}>
              <legend>Contactgegevens</legend>
              <label className={getLabelClassNames}>
                <AcTextInput {...getNameInputOptions} {...getInputOptions} />
              </label>
              <label className={getLabelClassNames}>
                <AcTextInput {...getEmailInputOptions} {...getInputOptions} />
              </label>
              <div className={getAdressClassNames}>
                <label className={getLabelClassNames}>
                  <AcTextInput
                    {...getStreetInputOptions}
                    {...getInputOptions}
                  />
                </label>
                <label className={getLabelClassNames}>
                  <AcTextInput
                    {...getNumberInputOptions}
                    {...getInputOptions}
                  />
                </label>
              </div>
              <div className={getCityClassNames}>
                <label className={getLabelClassNames}>
                  <AcTextInput
                    {...getPostalCodeInputOptions}
                    {...getInputOptions}
                  />
                </label>
                <label className={getLabelClassNames}>
                  <AcTextInput {...getCityInputOptions} {...getInputOptions} />
                </label>
              </div>
              <label className={getLabelClassNames}>
                <AcTextInput {...getChamberInputOptions} {...getInputOptions} />
              </label>
            </fieldset>
            {checkRemoveButton()}
            <AcButton {...getAddButtonOptions}>Wijzigingen opslaan</AcButton>
          </form>
        </div>
      </div>
    );
  };

  return renderClientForm();
};

export default AcFormClientNew;
