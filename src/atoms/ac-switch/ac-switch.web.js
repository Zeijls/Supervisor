// Imports => React
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  memo,
} from 'react';
import clsx from 'clsx';

// Imports => Constants
import { THEMES } from '@constants';

// Imports => Utilities
import { AcUUID, AcIsSet } from '@utils';

// Imports => Atoms
import AcRipple from '@atoms/ac-ripple/ac-ripple.web';

const _CLASSES = {
  MAIN: 'ac-switch',
  LIGHT: 'ac-switch--light',
  DARK: 'ac-switch--dark',
  ALPHA: 'ac-switch--alpha',
  ALPHA_LIGHT: 'ac-switch--alpha-light',
  SLOT: {
    MAIN: 'ac-switch__slot',
  },
  TRACKER: {
    MAIN: 'ac-switch__tracker',
    LEFT: 'ac-switch__tracker--move-left',
    RIGHT: 'ac-switch__tracker--move-right',
  },
  OPTION: {
    MAIN: 'ac-switch__option',
    SELECTED: 'ac-switch__option--selected',
    INPUT: 'ac-switch__input',
    PLACEHOLDER: 'ac-switch__placeholder',
    LABEL: 'ac-switch__label',
    DISABLED: 'ac-switch__option--disabled',
  },
};

// Component
const AcSwitch = ({ val, name, options, callback, theme, className }) => {
  const $element = useRef(null);
  const $tracker = useRef(null);

  const [value, setValue] = useState(val || (options && options[0].value));
  const [selected, setSelected] = useState(1);
  const [direction, setDirection] = useState('left');
  const [position, setPosition] = useState({
    left: 'auto',
    right: 0,
  });

  useEffect(() => {
    setInitialPosition();
  }, []);

  const setInitialPosition = () => {
    let initialSelection = false;

    options.forEach((option, n) => {
      option.index = n;

      if (isChecked(option)) {
        initialSelection = option;
      }
    });

    if (initialSelection) handleChangeEvent(false, initialSelection, true);
  };

  const handleChangeEvent = (event, option, initial) => {
    if (event) event.persist();

    if (value === option.value && !initial) return;

    if (!AcIsSet(option.index)) {
      const len = options.length;
      let n = 0;

      for (n; n < len; n++) {
        if (options[n].value === option.value) {
          break;
        }
      }

      option.index = n;
    }

    let newDirection = selected > option.index ? 'left' : 'right';

    setValue(option.value);
    setSelected(option.index);
    setDirection(newDirection);

    moveTracker(option.el);

    if (callback && event) callback(event, name, option.value);
  };

  const moveTracker = $option => {
    if (!$element || !$element.current) return;

    const offset = $element.current.getBoundingClientRect();
    const rect = $option.getBoundingClientRect();

    const object = {
      left: Math.round(rect.left - offset.left) + 'px',
      right: Math.round(offset.right - rect.right) + 'px',
    };

    setPosition(object);
  };

  const isChecked = useCallback(
    option => {
      return value === option.value;
    },
    [value]
  );

  const getOptionClassNames = useCallback(
    option => {
      return clsx(
        _CLASSES.OPTION.MAIN,
        value === option.value && _CLASSES.OPTION.SELECTED,
        option.disabled && _CLASSES.OPTION.DISABLED
      );
    },
    [value]
  );

  const getSlotClassNames = useMemo(() => {
    return clsx(_CLASSES.SLOT.MAIN);
  }, []);

  const getStyleClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN, theme && _CLASSES[theme.toUpperCase()]);
  }, [theme]);

  const getTrackerClassNames = useMemo(() => {
    return clsx(
      _CLASSES.TRACKER.MAIN,
      direction && _CLASSES.TRACKER[direction.toUpperCase()]
    );
  }, [direction]);

  const getTrackerPosition = useMemo(() => {
    return {
      left: position.left,
      right: position.right,
    };
  }, [position]);

  const getOptionInputClassNames = useMemo(() => {
    return clsx(_CLASSES.OPTION.INPUT);
  }, []);

  const getOptionLabelClassNames = useMemo(() => {
    return clsx(_CLASSES.OPTION.LABEL);
  }, []);

  const renderSwitchOptions = useMemo(() => {
    const len = options.length;
    let n = 0;
    let result = [];

    for (n; n < len; n++) {
      const option = options[n];
      if (!option.id) option.id = AcUUID();

      const obj = (
        <label
          htmlFor={`${name}-${option.id}`}
          key={option.id}
          ref={node => (option.el = node)}
          className={getOptionClassNames(option)}
          disabled={option.disabled}
        >
          <input
            type={'radio'}
            value={option.value}
            name={name}
            id={`${name}-${option.id}`}
            defaultChecked={isChecked(option)}
            onChange={event => handleChangeEvent(event, option)}
            className={getOptionInputClassNames}
            disabled={option.disabled}
          />
          <span className={getOptionLabelClassNames}>
            <AcRipple theme={THEMES.DARK} size={'small'} simple />
            {option.label}
          </span>
        </label>
      );

      result.push(obj);
    }

    return result;
  }, [options, value]);

  return (
    <div className={getStyleClassNames} ref={$element}>
      <div className={getSlotClassNames}>
        <div
          ref={$tracker}
          className={getTrackerClassNames}
          style={getTrackerPosition}
        />
        {renderSwitchOptions}
      </div>
    </div>
  );
};

export default memo(AcSwitch);
