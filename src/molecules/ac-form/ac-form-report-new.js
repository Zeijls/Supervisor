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
    FORMICON: {
      NEXT: 'ac-form__icon--next',
      BACK: 'ac-form__icon--back',
    },
  },
};

export const AcFormReportNew = ({
  store,
  navigation,
  onSubmit,
  contractId,
  is_loading,
}) => {
  const button_id = AcUUID();

  const [comment, setComment] = useState('');
  const [from_date, setFrom_date] = useState('');
  const [to_date, setTo_date] = useState('');
  // const [created_at, setCreated_at] = useState('');
  // const [updated_at, setUpdated_at] = useState('');
  const [errors, setErrors] = useState({
    [KEYS.COMMENT]: undefined,
    [KEYS.FROM_DATE]: undefined,
    [KEYS.TO_DATE]: undefined,
    // [KEYS.CREATED_AT]: undefined,
    // [KEYS.UPDATED_AT]: undefined,
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
    const { value, name } = event.target;

    switch (name) {
      case KEYS.COMMENT:
        setComment(value);
        break;

      case KEYS.FROM_DATE:
        setFrom_date(value);
        break;

      case KEYS.TO_DATE:
        setTo_date(value);
        break;

      // case KEYS.CREATED_AT:
      //   setCreated_at(value);
      //   break;

      // case KEYS.UPDATED_AT:
      //   setUpdated_at(value);
      //   break;
    }
  };

  const hasErrors = useMemo(() => {
    const result =
      !AcIsNull(errors[KEYS.COMMENT]) ||
      !AcIsNull(errors[KEYS.FROM_DATE]) ||
      !AcIsNull(errors[KEYS.TO_DATE]) ||
      // !AcIsNull(errors[KEYS.CREATED_AT]) ||
      // !AcIsNull(errors[KEYS.UPDATED_A]);
      console.log(errors, 'errros');

    return result;
  }, [comment, from_date, to_date, errors]);

  const handleSubmit = useCallback(
    (event) => {
      if (event && event.preventDefault) event.preventDefault();
      if (hasErrors) return;

      console.log(contractId, 'contract id');

      const data = {
        contract_id: contractId,
        comment,
        from_date,
        to_date,
      };

      console.log(data, 'data');
      if (onSubmit) onSubmit(data);
    },
    [contractId, comment, from_date, to_date, hasErrors]
  );

  const handleInputValidation = useCallback((name, value, type) => {
    let result = errors;

    switch (name) {
      case KEYS.COMMENT:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.FROM_DATE:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.TO_DATE:
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

  const getCommentInputOptions = useMemo(() => {
    return {
      label: 'Opmerking',
      name: KEYS.COMMENT,
      value: comment,
    };
  }, [comment, is_loading, handleInputValidation]);

  const getStartsDateCodeInputOptions = useMemo(() => {
    return {
      label: 'Startdatum',
      name: KEYS.FROM_DATE,
      value: from_date,
    };
  }, [from_date, is_loading, handleInputValidation]);

  const getEndsDateInputOptions = useMemo(() => {
    return {
      label: 'Einddatum',
      name: KEYS.TO_DATE,
      value: to_date,
    };
  }, [to_date, is_loading, handleInputValidation]);

  const renderClientForm = () => {
    return (
      <div className={getFormContainerClassNames}>
        <form className={getFormClassNames}>
          <h3 className={getTitleClassNames}>Nieuw Rapportage</h3>
          <fieldset className={getFieldsetClassNames}>
            <legend>Gegevens</legend>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getCommentInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput
                {...getInputOptions}
                {...getStartsDateCodeInputOptions}
              />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getEndsDateInputOptions} />
            </label>
          </fieldset>
          <AcButton {...getAddButtonOptions}>
            <span>Rapportage toevoegen</span>
          </AcButton>
        </form>
      </div>
    );
  };

  return renderClientForm();
};

export default AcFormReportNew;
