// Imports => React
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, TYPES } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import { types } from '@babel/core';

const _CLASSES = {
  CLIENTS: 'ac-form__clients',
  DROPDOWN: {
    CONTAINER: 'ac-drop-down__menu-container',
    TRIGGER: 'ac-drop-down__trigger',
    TRIGGERTITLE: 'ac-drop-down__triger-title',
    HEADER: 'ac-drop-down__header',
    TITLE: 'ac-drop-down__title',
    MENU: 'ac-drop-down__menu',
    MENU_ACTIVE: 'ac-drop-down__menu--active',
    LIST: 'ac-drop-down__list',
    ITEM: 'ac-drop-down__item',
    ITEMLABEL: 'ac-drop-down__item-label',
    INPUT: 'ac-drop-down__input',
    CHECKMARK: 'ac-drop-down__checkmark',
    FUNCTION: 'ac-drop-down__function',
    NAMEBLOCK: 'ac-drop-down__nameblock',
  },
};

export const AcDropDown = ({ fields, store, onSubmit }) => {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const onClick = (event) => {
    event.preventDefault();
    setIsActive(!isActive);
  };
  const { chosen_client_name } = store.clients;
  const { chosen_client_id } = store.clients;
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getDropDownTriggerClassNames = useMemo(() => {
    return clsx(_CLASSES.DROPDOWN.TRIGGER);
  }, []);

  const getDropdownListClassNames = useMemo(() => {
    return clsx(_CLASSES.DROPDOWN.LIST);
  }, []);

  const getCurrentClientsClassNames = useMemo(() => {
    return clsx(_CLASSES.CLIENTS);
  }, []);

  const getDropdownMenuClassNames = useMemo(() => {
    if (isActive) return clsx(_CLASSES.DROPDOWN.MENU_ACTIVE);

    return clsx(_CLASSES.DROPDOWN.MENU);
  });

  const getDropdownItemClassNames = useMemo(() => {
    return clsx(_CLASSES.DROPDOWN.ITEM);
  }, []);

  const getDropDownTriggerTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.DROPDOWN.TITLE);
  }, []);

  const getDropdownItemLabelClassName = useMemo(() => {
    return clsx(_CLASSES.DROPDOWN.ITEMLABEL);
  }, []);

  const getDropdownInputClassName = useMemo(() => {
    return clsx(_CLASSES.DROPDOWN.INPUT);
  }, []);

  const getDropdownCheckmarkClassName = useMemo(() => {
    return clsx(_CLASSES.DROPDOWN.CHECKMARK);
  }, []);

  const getDropdownFunctionClassName = useMemo(() => {
    return clsx(_CLASSES.DROPDOWN.FUNCTION);
  }, []);

  const getDDNameBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.DROPDOWN.NAMEBLOCK);
  }, []);

  const checkedClient = (event) => {
    if (event.target.checked) {
      const id = event.target.value;
      const name = event.target.name;
      store.clients.chosenClientId(id);
      store.clients.chosenClientName(name);
    }
  };

  const handleCallback = (event) => {
    event.preventDefault();
    if (onSubmit) onSubmit();
  };

  const getAddButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      variant: VARIANTS.EDIT,
      type: TYPES.SUBMIT,
      loading: is_loading,
      title: 'Contactpersoon toevoegen',
      callback: handleCallback,
    };
  }, []);

  const renderClients = useMemo(() => {
    if (!fields) {
      return null;
    }

    const collection = fields;
    // (.slice(0, 5);)
    const len = collection.length;
    let n = 0;
    let result = [];

    for (n; n < len; n++) {
      const item = collection[n];

      const object = (
        <div>
          <li className={getDropdownItemClassNames}>
            <label className={getDropdownItemLabelClassName}>
              <input
                value={item.id}
                name={item.name}
                className={getDropdownInputClassName}
                type="radio"
                onChange={(event) => checkedClient(event)}
              />
              <div className={getDDNameBlockClassNames}>
                <p className={getDropdownCheckmarkClassName}>{item.name}</p>
                <p className={getDropdownFunctionClassName}>{item.function}</p>
              </div>
            </label>
          </li>
        </div>
      );

      result.push(object);
    }

    return result;
  }, [fields]);

  const renderTriggerTitle = useMemo(() => {
    if (!chosen_client_id) {
      return (
        <label className={getDropdownItemLabelClassName}>
          <input className={getDropdownInputClassName} type="radio" />
          <span className={getDropDownTriggerTitleClassNames}>
            Selecteer een klant
          </span>
        </label>
      );
    } else {
      return (
        <li className={getDropdownItemClassNames}>
          <label className={getDropdownItemLabelClassName}>
            <input
              value={chosen_client_id}
              name={chosen_client_name}
              className={getDropdownInputClassName}
              type="radio"
              onChange={(event) => checkedClient(event)}
            />
            <span>{chosen_client_name}</span>
          </label>
        </li>
      );
    }
  }, [chosen_client_name]);

  const renderDropDown = useMemo(() => {
    return (
      <label className={getCurrentClientsClassNames}>
        Selecteer uit bestaande klanten
        <button onClick={onClick} className={getDropDownTriggerClassNames}>
          {renderTriggerTitle}
        </button>
        <nav ref={dropdownRef} className={getDropdownMenuClassNames}>
          <form>
            <ul className={getDropdownListClassNames}>
              {renderClients}{' '}
              <li className={getDropdownItemClassNames}>
                <label className={getDropdownItemLabelClassName}>
                  <AcButton {...getAddButtonOptions}>
                    <span>Contactpersoon toevoegen</span>
                  </AcButton>
                </label>
              </li>
            </ul>
          </form>
        </nav>
      </label>
    );
  });

  return <div> {renderDropDown}</div>;
};

export default withRouter(withStore(observer(AcDropDown)));
