// Imports => React
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
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
  MAIN: 'ac-page ac-home',
  FORM: {
    MAIN: 'ac-update-form',
    FORM: 'ac-update-form__form',
    TITLE: 'ac-form__title',
    FIELDSET: 'ac-update-form__fieldset',
    LEGEND: 'ac-update-form__legend',
    LABEL: 'ac-update-form__label',
    BUTTONS: {
      PRIMAIR: 'ac-buttons__primair',
      SECUNDAIR: 'ac-buttons__secundair',
      ADDCONTACT: 'ac-buttons__addContact',
    },
    NEXTONE: 'ac-update-form__next-one',
    REMOVE: 'ac-update-form__remove',
  },
};

const AcApplicationForm = ({
  fields,
  onSubmit,
  store,
  match,
  is_loading,
  id,
  onDelete,
  current_contract,
  application_id,
}) => {
  const button_id = AcUUID();
  const history = useHistory();

  const [name, setName] = useState((fields && fields.name) || '');
  const [description, setDescription] = useState(
    (fields && fields.description) || ''
  );
  const [git_provider, setGit_provider] = useState(
    (fields && fields.git_provider) || ''
  );
  const [git_repo, setGit_repo] = useState((fields && fields.git_repo) || '');
  const [errors, setErrors] = useState({
    [KEYS.NAME]: undefined,
    [KEYS.DESCRIPTION]: undefined,
    [KEYS.POSTAL_CODE]: undefined,
    [KEYS.GIT_PROVIDER]: undefined,
    [KEYS.GIT_REPO]: undefined,
  });

  useEffect(() => {
    if (fields && fields.name) setName(fields.name);
    if (fields && fields.description) setDescription(fields.description);
    if (fields && fields.git_provider) setGit_provider(fields.git_provider);
    if (fields && fields.git_repo) setGit_repo(fields.git_repo);
  }, [fields]);

  const getFormContainerClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.MAIN);
  }, []);

  const getFormClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FORM);
  }, []);

  const getFieldsetClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.FIELDSET);
  }, []);

  const getLegendClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.LEGEND);
  }, []);

  const getLabelClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.LABEL);
  }, []);

  const getNextOneButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.NEXTONE);
  }, []);

  const getRemoveButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.FORM.REMOVE);
  }, []);

  const handleInputChange = (event) => {
    if (event && event.persist) event.persist();
    const { value, name } = event.target;

    switch (name) {
      case KEYS.NAME:
        setName(value);
        break;

      case KEYS.DESCRIPTION:
        setDescription(value);
        break;

      case KEYS.GIT_PROVIDER:
        setGit_provider(value);
        break;

      case KEYS.GIT_REPO:
        setGit_repo(value);
    }
  };

  const hasErrors = useMemo(() => {
    const result =
      !AcIsNull(errors[KEYS.NAME]) ||
      !AcIsNull(errors[KEYS.DESCRIPTION]) ||
      !AcIsNull(errors[KEYS.GIT_PROVIDER]) ||
      !AcIsNull(errors[KEYS.GIT_REPO]);

    return result;
  }, [name, description, git_provider, git_repo, errors]);

  const handleSubmit = useCallback(
    (event) => {
      if (event && event.preventDefault) event.preventDefault();
      if (hasErrors) return;
      const contract_id = fields.contracts.id;

      const data = {
        contract_id: contract_id,
        name,
        description,
        git_provider,
        git_repo,
      };

      console.log(data, 'data');

      if (onSubmit) onSubmit(data, application_id);
    },
    [name, description, git_provider, git_repo]
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

      case KEYS.DESCRIPTION:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.GIT_REPO:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.GIT_PROVIDER:
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

  const getNameInputOptions = useMemo(() => {
    return {
      label: 'Naam',
      name: KEYS.NAME,
      value: name,
    };
  }, [name]);

  const getDescriptionInputOptions = useMemo(() => {
    return {
      label: 'Beschrijving',
      name: KEYS.DESCRIPTION,
      value: description,
    };
  }, [description]);

  const getProviderInputOptions = useMemo(() => {
    return {
      label: 'Provider',
      name: KEYS.GIT_PROVIDER,
      value: git_provider,
    };
  }, [git_provider]);

  const getRepoInputOptions = useMemo(() => {
    return {
      label: 'Repository',
      name: KEYS.GIT_REPO,
      value: git_repo,
    };
  }, [git_repo]);

  const removeItem = async () => {
    console.log(application_id, 'application id');
    if (onDelete) onDelete(application_id);
  };

  // const redirectItem = () => {
  //   if (current_contract) const { current_contract } = store.contracts;
  //   const { id } = current_contract;
  //   const redirectOverview = ROUTES.CONTRACTDETAIL.path.replace(':id?', id);
  //   history.push(redirectOverview);
  // };

  const getAddButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      loading: is_loading,
      title: 'Opslaan',
      disabled: hasErrors || is_loading,
      callback: handleSubmit,
    };
  }, [is_loading, handleInputValidation, hasErrors, handleSubmit]);

  const checkRemoveButton = () => {
    if (fields && fields.name) {
      return (
        <AcRemoveButton
          className={getRemoveButtonClassNames}
          onSubmit={removeItem}
        />
      );
    } else return null;
  };

  const renderApplicationForm = useMemo(() => {
    return (
      <div className={getFormContainerClassNames}>
        <form className={getFormClassNames} onSubmit={handleSubmit}>
          <fieldset className={getFieldsetClassNames}>
            <legend className={getLegendClassNames}>Applicatie</legend>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getNameInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput
                {...getInputOptions}
                {...getDescriptionInputOptions}
              />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getProviderInputOptions} />
            </label>
            <label className={getLabelClassNames}>
              <AcTextInput {...getInputOptions} {...getRepoInputOptions} />
            </label>
          </fieldset>
          <AcButton {...getAddButtonOptions} type="submit">
            Opslaan
          </AcButton>
          {checkRemoveButton()}
        </form>
      </div>
    );
  });

  return <div> {renderApplicationForm} </div>;
};

export default AcApplicationForm;
