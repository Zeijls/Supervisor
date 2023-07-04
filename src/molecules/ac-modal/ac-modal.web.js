// Imports => React
import React, { useCallback, useRef, useMemo, useEffect, memo } from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import clsx from 'clsx';

// Imports => Constants
import { ICONS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Hooks
import { useUIActions } from '@hooks';

// Imports => Atoms
import AcCard from '@atoms/ac-card/ac-card.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';
import AcButton from '@atoms/ac-button/ac-button.web';
import AcRipple from '@atoms/ac-ripple/ac-ripple.web';

const _CLASSES = {
  MAIN: 'ac-modal',
  OPEN: 'ac-modal--visible',
  CENTERED: 'ac-modal--centered',
  CARD: 'ac-modal__card',
  OFFSET: 'ac-modal__card--offset',
  TITLE: 'ac-modal__title',
  CONTENT: 'ac-modal__content',
  ACTION_BAR: {
    MAIN: 'ac-modal__action-bar',
  },
  ACTION: {
    MAIN: 'ac-modal__action',
    CANCEL: 'ac-modal__action--cancel',
    CONFIRM: 'ac-modal__action--confirm',
  },
  ICON: {
    MAIN: 'ac-icon',
    CLOSE: 'ac-icon--close ac-modal__close-icon',
  },
};

// Component
const AcModal = ({
  id = AcUUID(),
  title,
  children,
  actions,
  callback,
  visible = false,
  closeable = true,
  offset = false,
  centered = false,
  width,
  height,
}) => {
  const $modal = useRef(null);

  useEffect(() => {
    if (closeable) addEvents();
    if (!closeable) removeEvents();

    return () => removeEvents();
  }, [visible, closeable, children, title]);

  const addEvents = () => {
    document.addEventListener('keyup', handleKeyUp, { passive: true });
  };

  const removeEvents = () => {
    document.removeEventListener('keyup', handleKeyUp, { passive: true });
  };

  const handleKeyUp = (event) => {
    if (!visible || !closeable) return;

    if (event && event.persist) event.persist();
    const key = event.key || event.which;

    if ($modal && $modal.current) {
      const inside = $modal.current.contains(event.target);

      if (inside) return;
    }

    if (key) {
      switch (key) {
        case 'Escape':
        case 27:
          handleCloseCallback(event);
          break;

        default:
      }
    }
  };

  const handleBackdropClick = (event) => {
    if (!closeable) return;
    if (event && event.persist) event.persist();
    if (event && event.preventDefault) event.preventDefault();
    if (event.target && event.target.classList.contains(_CLASSES.MAIN)) {
      handleCloseCallback(event);
    }
  };

  const handleActionCallback = useCallback((event, action) => {
    if ((event, event.preventDefault)) event.preventDefault();

    if (action.callback) action.callback(event);
  }, []);

  const handleCloseCallback = (event) => {
    if (event && event.persist) event.persist();
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    if (callback) callback(event);
  };

  const renderActions = useMemo(() => {
    return actions.map((action, index) => {
      return (
        <AcButton
          key={`ac-modal__button-${index}`}
          callback={(event) => {
            handleActionCallback(event, action);
          }}
          theme={action.theme}
          variant={action.variant}
          className={getActionClassNames(action)}
        >
          {action.title}
          {action.variant !== 'transparent' && (
            <AcRipple theme={action.theme} />
          )}
        </AcButton>
      );
    });
  }, [actions]);

  const getActionClassNames = useCallback((action) => {
    return clsx(
      _CLASSES.ACTION.MAIN &&
        action.type &&
        _CLASSES.ACTION[action.type.toUpperCase()]
    );
  }, []);

  const getActionsBarStyleClassNames = useMemo(() => {
    return clsx(_CLASSES.ACTION_BAR.MAIN);
  }, []);

  const getContentStyleClassNames = useMemo(() => {
    return clsx(_CLASSES.CONTENT);
  }, []);

  const getTitleStyleClassNames = useMemo(() => {
    return clsx(_CLASSES.TITLE);
  }, []);

  const getCardStyleClassNames = useMemo(() => {
    return clsx(_CLASSES.CARD, offset && _CLASSES.OFFSET);
  }, [offset]);

  const getCloseIconClassNames = useMemo(() => {
    return clsx(_CLASSES.ICON.MAIN, _CLASSES.ICON.CLOSE);
  }, []);

  const getStyleClassNames = useMemo(() => {
    return clsx(
      _CLASSES.MAIN,
      visible && _CLASSES.OPEN,
      centered && _CLASSES.CENTERED
    );
  }, [visible, centered]);

  return (
    <div className={getStyleClassNames} onClick={handleBackdropClick}>
      <AcCard
        className={getCardStyleClassNames}
        width={width}
        height={height}
        hoverAnimation={false}
        ref={$modal}
      >
        {title && (
          <div
            className={getTitleStyleClassNames}
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        )}
        {closeable && (
          <AcIcon
            icon={ICONS.CLOSE}
            className={getCloseIconClassNames}
            callback={handleCloseCallback}
          />
        )}
        <ReactCSSTransitionReplace
          transitionName="fade-wait"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          <div key={id} className={getContentStyleClassNames}>
            {children}
          </div>
        </ReactCSSTransitionReplace>
        {actions && actions.length > 0 && (
          <div className={getActionsBarStyleClassNames}>{renderActions}</div>
        )}
      </AcCard>
    </div>
  );
};

export default memo(AcModal);
