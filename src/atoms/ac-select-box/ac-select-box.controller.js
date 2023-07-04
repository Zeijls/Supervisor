// Imports => React
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

// Imports => Utilities
import { AcUUID, AcIsSet } from '@utils';

const _CLASSES = {
  MAIN: 'ac-select-box',
  HAS_VALUE: 'ac-select-box--selected',
  INPUT: {
    MAIN: 'ac-select-box__input',
    LABEL: 'ac-select-box__input-label',
  },
  DISABLED: 'ac-select-box--disabled',
  LABEL: 'ac-select-box__label',
  OPEN: 'ac-select-box--open',
  ERROR: 'ac-select-box--error',
  LIST: {
    MAIN: 'ac-select-box__list',
    ITEM: 'ac-select-box__list__item',
    ITEM_STATIC: 'ac-select-box__list__item--static',
  },
  VALIDATION: {
    ERROR: 'ac-select-box__error',
  },
  INSTRUCTIONS: 'ac-select-box__instructions',
};

// Controller
class AcSelectBoxController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hasError: props.error,
      reference: AcUUID(),
      value: props.value,
      query: '',
      selectedLabel: this.getLabelFromValue(props.value),
      name: props.name,
      tabindex: this.props.tabindex || 0,
      listHeight: 0,
      open: false,
    };

    this.$element = React.createRef();
    this.$list = React.createRef();

    this.onItemClick = this.onItemClick.bind(this);
    this.toggleOptions = this.toggleOptions.bind(this);
    this.parseOptionsList = this.parseOptionsList.bind(this);
    this.hide = this.hide.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value === prevState.value) return prevState;

    return {
      ...prevState,
      value: nextProps.value,
    };
  }

  componentDidMount() {
    const listHeight = this.$list.current && this.$list.current.scrollHeight;

    this.setState({
      listHeight,
    });

    document.addEventListener('click', this.hide, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hide, false);
  }

  updateQuery = value => {
    this.setState({ query: value }, () => {
      this.toggleOptions(true);
    });
  };

  hide(event) {
    if (event && event.persist) event.persist();
    if (event && event.target) {
      const $element = this.$element.current;

      if ($element) {
        const inside = $element.contains(event.target);

        if (!inside) {
          this.toggleOptions(false);
        }
      }
    }
  }

  getLabelFromValue(value) {
    const { options, placeholder } = this.props;
    if (typeof value === 'undefined' || value === null || value === '')
      return placeholder;
    const selectedOption = options.find(option => option.value === value);

    return selectedOption && selectedOption.label;
  }

  onItemClick(event, option) {
    if (event && event.persist) event.persist();

    const value = option.value;
    const { name, validation } = this.props;
    let hasError = false;

    if (validation) {
      hasError = validation(name, value, null);
    }

    this.setState(
      {
        selectedLabel: option.label,
        query: '',
        hasError,
        value,
      },
      () => this.callback(event, value)
    );
  }

  callback(event, value) {
    const { name, hasError } = this.state;

    if (!hasError) {
      const { callback } = this.props;
      if (callback) callback(event, name, value);
    }
  }

  getPlaceholder() {
    const { placeholder } = this.props;
    return placeholder || undefined;
  }

  toggleOptions(_open) {
    const { disabled, options } = this.props;
    const filteredOptions = this.parseOptionsList(options);
    if (disabled || filteredOptions.length === 0) return false;

    const { open } = this.state;

    const status =
      typeof _open !== 'undefined' && typeof _open !== 'object' ? _open : !open;

    this.setState({
      open: status,
    });
  }

  parseOptionsList() {
    const { value, query } = this.state;
    const { options } = this.props;

    let optionsList = options.slice(0).filter(option => {
      return option.value !== value;
    });

    if (AcIsSet(query) && query !== '') {
      const substring = query.toLowerCase();

      optionsList = optionsList.filter(option => {
        const string = option.label.toLowerCase();
        return string.indexOf(substring) > -1;
      });
    }

    return optionsList;
  }

  getStyleClassNames() {
    const { disabled, className, placeholder } = this.props;
    const { hasError, open, value } = this.state;

    return clsx(
      _CLASSES.MAIN,
      disabled && _CLASSES.DISABLED,
      open && _CLASSES.OPEN,
      hasError && _CLASSES.ERROR,
      placeholder && _CLASSES.PLACEHOLDER,
      value && _CLASSES.HAS_VALUE,
      className
    );
  }

  getInputLabelClassNames() {
    return clsx(_CLASSES.INPUT.LABEL);
  }

  getInputClassNames() {
    return clsx(_CLASSES.INPUT.MAIN);
  }

  getLabelClassNames() {
    return clsx(_CLASSES.LABEL);
  }

  getErrorClassNames() {
    return clsx(_CLASSES.VALIDATION.ERROR);
  }

  getListClassNames() {
    return clsx(_CLASSES.LIST.MAIN);
  }

  getListItemClassNames(_static) {
    return clsx(_CLASSES.LIST.ITEM, _static && _CLASSES.LIST.ITEM_STATIC);
  }

  getInstructionsClassNames() {
    return clsx(_CLASSES.INSTRUCTIONS);
  }

  getSearchInputClassNames() {
    return clsx(_CLASSES.SEARCH_INPUT);
  }

  getListInlineStyles() {
    const { open, listHeight } = this.state;
    const { options, maxOptions, offset } = this.props;
    const list = this.parseOptionsList();
    let len = list ? list.length : options.length;
    const available = Math.min(len, maxOptions);

    let height = 0;

    if (this.$list.current && this.$list.current.childNodes) {
      const children = Array.prototype.slice.call(
        this.$list.current.childNodes
      );
      children
        .slice(0, available)
        .forEach(node => (height += node.scrollHeight));
    }

    const _height = (AcIsSet(height) ? height : listHeight) + offset;

    return {
      height: open ? `${_height / 10}rem` : '0rem',
    };
  }
}

AcSelectBoxController.propTypes = {
  callback: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  maxOptions: PropTypes.number,
  offset: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: function(props, propName) {
    if (
      props['value'] === undefined &&
      (props[propName] === undefined || typeof props[propName] !== 'string')
    ) {
      return new Error('Please provide a value or placeholder property!');
    }
  },
  disabled: PropTypes.bool,
  validation: PropTypes.func,
  instructions: PropTypes.string,
  error: PropTypes.oneOf([PropTypes.bool, PropTypes.string]),
};

AcSelectBoxController.defaultProps = {
  type: 'text',
  autocomplete: false,
  disabled: false,
  maxOptions: 5,
  offset: 0,
};

export default AcSelectBoxController;
