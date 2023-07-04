// Imports => React
import React, { useRef, forwardRef, useMemo, memo } from 'react';
import clsx from 'clsx';

// Imports => Atoms
import AcRipple from '@atoms/ac-ripple/ac-ripple.web';

const _CLASSES = {
  MAIN: 'ac-button',
  SIZES: {
    DEFAULT: 'ac-button--regular',
    SMALL: 'ac-button--small',
  },
  THEME: {
    DEFAULT: 'ac-button--pitch',
    OUTLINE: 'ac-button--outline',
    PITCH: {
      MAIN: 'ac-button--pitch',
      DEFAULT: '',
      OUTLINE: 'ac-button--pitch-outline',
      TRANSPARENT: 'ac-button--pitch-transparent',
    },
    WHITE: {
      MAIN: 'ac-button--white',
      DEFAULT: 'ac-button--white',
      OUTLINE: 'ac-button--white-outline',
      TRANSPARENT: 'ac-button--white-transparent',
      EDIT: 'ac-button--white-edit',
      ADD: 'ac-button--white-add',
      LINK: 'ac-button--white-link',
    },
    SUBTLE: {
      MAIN: 'ac-button--subtle',
      DEFAULT: 'ac-button--subtle',
      OUTLINE: 'ac-button--subtle-outline',
      TRANSPARENT: 'ac-button--subtle-transparent',
    },
    ALPHA: {
      MAIN: 'ac-button--alpha',
      DEFAULT: 'ac-button--alpha',
      NEWCARD: 'ac-button--new-card',
      CARD: 'ac-button--card',
      OUTLINE: 'ac-button--alpha-outline',
      TRANSPARENT: 'ac-button--alpha-transparent',
      REMOVE: 'ac-button--alpha-remove',
    },
    TAB: {
      MAIN: 'ac-button--tab',
      DEFAULT: 'ac-button--tab',
      OUTLINE: 'ac-button--tab-outline',
      TRANSPARENT: 'ac-button--tab-transparent',
      REMOVE: 'ac-button--tab-remove',
    },
    OMEGA: {
      MAIN: 'ac-button--omega',
      DEFAULT: 'ac-button--omega',
      OUTLINE: 'ac-button--omega-outline',
      TRANSPARENT: 'ac-button--omega-transparent',
    },
    DELTA: {
      MAIN: 'ac-button--delta',
      DEFAULT: 'ac-button--delta',
      OUTLINE: 'ac-button--delta-outline',
      TRANSPARENT: 'ac-button--delta-transparent',
    },
    WARNING: {
      MAIN: 'ac-button--warning',
      DEFAULT: 'ac-button--warning',
      OUTLINE: 'ac-button--warning-outline',
    },
  },
  BLOCK: 'ac-button--block',
  DISABLED: 'ac-button--disabled',
  LOADING: 'ac-button--loading',
  LOADER: 'ac-button__loader',
};

// Component
const AcButton = forwardRef(
  (
    {
      children,
      tag = 'button',
      title = 'button',
      type = 'button',
      theme = 'default',
      variant = 'default',
      size = 'default',
      disabled = false,
      block = false,
      loading = false,
      callback = () => {},
      className,
      ...rest
    },
    ref
  ) => {
    const $element = useRef();

    const handleClick = (event) => {
      if (!disabled && callback) callback(event, $element.current);
    };

    const getLoaderClassNames = useMemo(() => {
      return clsx(_CLASSES.LOADER);
    }, []);

    const getThemeAndStyleClassNames = (theme, variant) => {
      let className = false;

      const match = {
        theme: theme
          ? theme.replace('-', '').replace('_', '').trim().toUpperCase()
          : false,
        variant: variant
          ? variant.replace('-', '').replace('_', '').trim().toUpperCase()
          : false,
      };

      if (match.theme && match.variant) {
        className = _CLASSES.THEME[match.theme][match.variant];
      } else if (match.theme) {
        className = _CLASSES.THEME[match.theme].MAIN;
      } else if (match.variant) {
        className = _CLASSES.THEME.OUTLINE;
      }

      return className;
    };

    const getStyleClassNames = useMemo(() => {
      return clsx(
        _CLASSES.MAIN,
        getThemeAndStyleClassNames(theme, variant),
        size && _CLASSES.SIZES[size.toUpperCase()],
        disabled && _CLASSES.DISABLED,
        block && _CLASSES.BLOCK,
        loading && _CLASSES.LOADING,
        className
      );
    }, [size, disabled, block, theme, variant, loading, className]);

    const Tag = tag;

    return (
      <Tag
        ref={ref || $element}
        type={type}
        aria-roledescription={'button'}
        disabled={disabled}
        onClick={handleClick}
        className={getStyleClassNames}
        {...rest}
      >
        <div className={getLoaderClassNames} />
        {children || 'Button'}
        <AcRipple size={'small'} simple />
      </Tag>
    );
  }
);

export default memo(AcButton);
