// Imports => React
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Import => Utilities
import { AcUUID, AcIsSet, AcIsEmptyString } from '@utils';

const _CLASSES = {
  MAIN: 'ac-text-input',
  WHITE: 'ac-text-input--white',
  DISABLED: 'ac-text-input--disabled',
  READONLY: 'ac-text-input--readonly',
  ERROR: 'ac-text-input--error',
  SUCCESS: 'ac-text-input--success',
  EMPTY: 'ac-text-input--empty',
  PLACEHOLDER: 'ac-text-input--placeholder',
  LABEL: {
    MAIN: 'ac-text-input__label',
    TITLE: 'ac-text-input__label__title',
  },
  INPUT: {
    MAIN: 'ac-text-input__field',
    PASSWORD: 'ac-text-input__field--password',
    TEXTAREA: 'ac-text-input__field--textarea',
  },
  VALIDATION: {
    ERROR: 'ac-text-input__error',
    SUCCESS: 'ac-text-input__success',
  },
  INSTRUCTIONS: 'ac-text-input__instructions',
  EYE: {
    MAIN: 'ac-text-input__eye',
    OPEN: 'ac-text-input__eye--open',
  },
};

// Controller
class AcTextInputController extends React.Component {
  constructor(props) {
    super(props);

    this.element = React.createRef();

    this.state = {
      hasError: props.error,
      reference: props.id || AcUUID(),
      value: props.value,
      name: props.name,
      tabindex: props.tabindex || 0,
      type: props.type,
      touched: false,
    };

    this.selection = {
      start: false,
      end: false,
    };
  }

  componentDidMount() {
    this.setFocus();
    this.onChange(null, this.state.value, false);

    if (this.element && this.element.current) {
      this.element.current.addEventListener('keyup', this.handleKeyup, {
        passive: true,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.focus !== this.props.focus && this.props.focus) {
      this.setFocus();
    }

    if (
      prevProps.error !== this.props.error &&
      this.props.error !== prevState.error
    ) {
      this.setState({ hasError: this.props.error });
    }

    if (prevProps.value !== this.props.value) {
      this.onChange(null, this.props.value, false);
    }
  }

  componentWillUnmount() {
    if (this.element && this.element.current) {
      this.element.current.removeEventListener(
        'keyup',
        this.handleKeyup,
        false
      );
    }
  }

  handleKeyup = (event) => {
    this.setState({ touched: true });
  };

  onBlur = (event) => {
    if (!event) return;
    if (event && event.persist) event.persist();

    const { name, type, onBlur } = this.props;
    const value = event && event.target.value;

    if (onBlur) onBlur(event, name, value, type);
  };

  onFocus = (event) => {
    if (!event) return;
    if (event && event.persist) event.persist();

    const { name, type, onFocus } = this.props;
    const value = event && event.target.value;

    if (onFocus) onFocus(event, name, value, type);
  };

  setFocus = () => {
    const { focus, delay } = this.props;
    let time = focus && focus === 'delayed' ? (delay ? delay : 3000) : 300;

    if (focus) {
      setTimeout(() => {
        const $element = this.element.current;
        if ($element && $element.focus) {
          $element.focus();
          // $element.click();
        }
      }, time);
    }
  };

  onKeyUp = (event) => {
    if (
      this.element.current.selectionStart &&
      this.element.current.selectionEnd
    ) {
      this.selection = {
        start: this.element.current.selectionStart,
        end: this.element.current.selectionEnd,
      };
    }
  };

  onChange = (event, defaultValue = '', emit = true) => {
    if (event && event.persist) event.persist();
    const { name, validation, type, required } = this.props;

    const value = (event && event.target && event.target.value) || defaultValue;
    let hasError = false;

    if (validation) {
      hasError = validation(name, value, required, type);
    }

    this.setState(
      {
        hasError,
      },
      () => {
        if (emit) this.callback(event, name, value, type);
      }
    );
  };

  callback = (event, name, value, type) => {
    const { callback } = this.props;

    if (callback) callback(event, name, value, type);
  };

  getPlaceholder = () => {
    const { placeholder } = this.props;
    return placeholder || undefined;
  };

  getInputClassNames = () => {
    const { type, inputClassNames } = this.props;

    return clsx(
      _CLASSES.INPUT.MAIN,
      type && type === 'password' && _CLASSES.INPUT.PASSWORD,
      type && type === 'textarea' && _CLASSES.INPUT.TEXTAREA,
      inputClassNames
    );
  };

  getLabelClassNames = () => {
    return clsx(_CLASSES.LABEL.MAIN);
  };

  getLabelTitleClassNames = () => {
    return clsx(_CLASSES.LABEL.TITLE);
  };

  getErrorClassNames = () => {
    return clsx(_CLASSES.VALIDATION.ERROR);
  };

  getSuccessClassNames = () => {
    return clsx(_CLASSES.VALIDATION.SUCCESS);
  };

  getInstructionsClassNames = () => {
    return clsx(_CLASSES.INSTRUCTIONS);
  };

  getStyleClassNames = () => {
    const {
      value,
      disabled,
      readonly,
      className,
      placeholder,
      theme,
    } = this.props;
    const { hasError } = this.state;

    return clsx(
      _CLASSES.MAIN,
      disabled && _CLASSES.DISABLED,
      readonly && _CLASSES.READONLY,
      (!AcIsSet(value) || AcIsEmptyString(value)) && _CLASSES.EMPTY,
      hasError && _CLASSES.ERROR,
      !hasError && AcIsSet(value) && _CLASSES.SUCCESS,
      placeholder && _CLASSES.PLACEHOLDER,
      theme && _CLASSES[theme.toUpperCase()],
      className
    );
  };
}

AcTextInputController.propTypes = {
  callback: PropTypes.func,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'number',
    'tel',
    'email',
    'date',
    'password',
    'textarea',
  ]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
  validation: PropTypes.func,
  autocomplete: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  instructions: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  indicator: PropTypes.bool,
  withSuccess: PropTypes.bool,
};

AcTextInputController.defaultProps = {
  type: 'text',
  autocomplete: 'off',
  disabled: false,
  required: true,
  readonly: false,
  indicator: false,
  withSuccess: true,
};

export default AcTextInputController;
