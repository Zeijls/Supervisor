// Imports => React
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Utilities
import {
  AcIsSet,
  AcIsNull,
  AcIsEmptyString,
  AcIsEmail,
  AcSupportsWEBP,
  AcGetState,
  AcSaveState,
  AcClearState,
} from '@utils';

// Imports => Constants
import {
  DEFAULT_ROUTE,
  KEYS,
  ROUTES,
  THEMES,
  TITLES,
  TYPES,
  VARIANTS,
} from '@constants';

// Imports => Atoms
import { AcContainer, AcRow, AcColumn } from '@atoms/ac-grid';
import AcImage from '@atoms/ac-image/ac-image.web';
import AcCard from '@atoms/ac-card/ac-card.web';
import AcHeading from '@atoms/ac-heading/ac-heading.web';
import AcTextInput from '@atoms/ac-text-input/ac-text-input.web';
import AcButton from '@atoms/ac-button/ac-button.web';

const _CLASSES = {
  MAIN: 'ac-page ac-page--fullscreen ac-login',
};

const AcLogin = ({ store }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    [KEYS.EMAIL]: undefined,
    [KEYS.PASSWORD]: undefined,
  });

  useEffect(() => {
    AcClearState();
  }, []);

  const hasErrors = useMemo(() => {
    const result =
      !AcIsNull(errors[KEYS.EMAIL]) || !AcIsNull(errors[KEYS.PASSWORD]);
    return result;
  }, [email, password, errors]);

  const handleForgotPassword = useCallback(
    (event) => {
      if (event && event.preventDefault) event.preventDefault();

      const { push } = history;
      if (push) push(ROUTES.FORGOT_PASSWORD.path);
    },
    [history]
  );

  const handleFormSubmit = useCallback(
    (event) => {
      if (event && event.preventDefault) event.preventDefault();
      if (hasErrors) return;

      store.auth
        .login({ username: email, password })
        .then(() => {
          const { replace } = history;
          console.log('replace', replace);
          if (replace) replace(DEFAULT_ROUTE.path);
        })
        .catch((error) => {
          // display error
        });
    },
    [email, password, hasErrors, history]
  );

  const handleInputValidation = useCallback((name, value, type) => {
    let result = errors;

    switch (name) {
      case KEYS.EMAIL:
        if (!AcIsSet(value) || AcIsEmptyString(value)) {
          result[name] = true;
        } else if (!AcIsEmptyString(value) && !AcIsEmail(value)) {
          result[name] = true;
        } else {
          result[name] = null;
        }
        break;

      case KEYS.PASSWORD:
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

  const handleInputChange = (event, name, value, type) => {
    if (event && event.persist) event.persist();

    switch (name) {
      case KEYS.EMAIL:
        setEmail(value);
        break;

      case KEYS.PASSWORD:
        setPassword(value);
        break;

      default:
    }
  };

  const getEmailInputOptions = useMemo(() => {
    return {
      label: 'Email address',
      placeholder: 'name@domain.com',
      type: TYPES.EMAIL,
      name: KEYS.EMAIL,
      value: email,
      required: true,
      focus: true,
      disabled: is_loading,
      validation: handleInputValidation,
      autoComplete: 'new-password',
      callback: handleInputChange,
    };
  }, [email, is_loading, handleInputValidation]);

  const getPasswordInputOptions = useMemo(() => {
    return {
      label: 'Password',
      type: TYPES.PASSWORD,
      name: KEYS.PASSWORD,
      value: password,
      required: true,
      disabled: is_loading,
      validation: handleInputValidation,
      autoComplete: 'new-password',
      callback: handleInputChange,
    };
  }, [password, is_loading, handleInputValidation]);

  const getSubmitButtonOptions = useMemo(() => {
    return {
      type: TYPES.SUBMIT,
      theme: THEMES.ALPHA,
      disabled: hasErrors || is_loading,
      loading: is_loading,
      title: 'Login',
      callback: handleFormSubmit,
    };
  }, [email, password, hasErrors, is_loading, handleFormSubmit]);

  const getForgotPasswordButtonOptions = useMemo(() => {
    return {
      type: TYPES.BUTTON,
      theme: THEMES.OMEGA,
      variant: VARIANTS.TEXT,
      disabled: is_loading,
      title: 'Forgot your password?',
      callback: handleForgotPassword,
    };
  }, [is_loading, handleForgotPassword]);

  const getMainClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  return (
    <div className={getMainClassNames}>
      <AcContainer fluid>
        <AcRow>
          <AcColumn
            xxs={12}
            xs={{ size: 10, offset: 1 }}
            sm={{ size: 8, offset: 2 }}
            md={{ size: 6, offset: 3 }}
            lg={{ size: 4, offset: 4 }}
          >
            <AcCard className={'h-padding-x-15 h-padding-y-15'}>
              <form
                method={'post'}
                autoComplete={'off'}
                onSubmit={handleFormSubmit}
              >
                <AcContainer className={'h-text--align-left h-padding-y-20'}>
                  <AcRow>
                    <AcColumn>
                      <AcHeading rank={2}>{TITLES.BASE}</AcHeading>
                    </AcColumn>
                  </AcRow>

                  <AcRow>
                    <AcColumn>
                      <AcTextInput {...getEmailInputOptions} />
                    </AcColumn>
                  </AcRow>

                  <AcRow>
                    <AcColumn>
                      <AcTextInput {...getPasswordInputOptions} />
                    </AcColumn>
                  </AcRow>

                  <AcRow className={'h-margin-top-25'}>
                    <AcColumn
                      xxs={12}
                      xs={7}
                      sm={6}
                      className={'h-text--align-left h-flex-v-align-center'}
                    >
                      <AcButton {...getForgotPasswordButtonOptions}>
                        <span>Forgot your password?</span>
                      </AcButton>
                    </AcColumn>

                    <AcColumn
                      xxs={12}
                      xs={5}
                      sm={6}
                      className={'h-text--align-right'}
                    >
                      <AcButton {...getSubmitButtonOptions}>
                        <span>Log in</span>
                      </AcButton>
                    </AcColumn>
                  </AcRow>
                </AcContainer>
              </form>
            </AcCard>
          </AcColumn>
        </AcRow>
      </AcContainer>
    </div>
  );
};

export default withStore(observer(AcLogin));
