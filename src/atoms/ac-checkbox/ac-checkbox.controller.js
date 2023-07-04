// Imports => React
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { AcUUID } from '@utils';

const _CLASSES = {
  MAIN: 'ac-checkbox',
  DISABLED: 'ac-checkbox--disabled',
  BEFORE: 'ac-checkbox--before',
  AFTER: 'ac-checkbox--after',
  INPUT: {
    MAIN: 'ac-checkbox__input',
    DISABLED: 'ac-checkbox__input--disabled',
  },
  DISPLAY: {
    MAIN: 'ac-checkbox__display',
    DISABLED: 'ac-checkbox__display--disabled',
  },
  LABEL: {
    MAIN: 'ac-checkbox__label',
    DISABLED: 'ac-checkbox__label--disabled',
    BEFORE: 'ac-checkbox__label--before',
    AFTER: 'ac-checkbox__label--after',
  },
};

// Controller
class AcCheckboxController extends React.Component {
  constructor(props) {
    super(props);

    this.display = false;

    this.state = {
      ref: AcUUID(),
      checked: props.checked,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checked === prevState.checked) return prevState;

    return {
      ...prevState,
      checked: nextProps.checked,
    };
  }

  onChangeEvent = event => {
    if (event && event.persist) event.persist();
    const { checked } = this.state;
    const { name, value, callback } = this.props;

    const selected = !checked;

    this.setState({ checked: selected }, () => {
      if (callback) callback(event, name, value, selected);
    });
  };

  isChecked = () => {
    return this.state.checked;
  };

  getStyleClassNames() {
    const { disabled, position } = this.props;

    return clsx(
      _CLASSES.MAIN,
      disabled && _CLASSES.DISABLED,
      position && _CLASSES[position.toUpperCase()]
    );
  }

  getLabelClassNames() {
    const { disabled, position } = this.props;

    return clsx(
      _CLASSES.LABEL.MAIN,
      disabled && _CLASSES.LABEL.DISABLED,
      position && _CLASSES.LABEL[position.toUpperCase()]
    );
  }

  getInputClassNames() {
    const { disabled } = this.props;

    return clsx(_CLASSES.INPUT.MAIN, disabled && _CLASSES.INPUT.DISABLED);
  }

  getDisplayClassNames() {
    const { disabled } = this.props;

    return clsx(_CLASSES.DISPLAY.MAIN, disabled && _CLASSES.DISPLAY.DISABLED);
  }
}

AcCheckboxController.propTypes = {
  children: PropTypes.any,
  value: PropTypes.any.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  position: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  classStyle: PropTypes.string,
};

AcCheckboxController.defaultProps = {
  children: 'I am a checkbox',
  checked: false,
  disabled: false,
  position: 'after',
  classStyle: 'primary',
};

export default AcCheckboxController;
