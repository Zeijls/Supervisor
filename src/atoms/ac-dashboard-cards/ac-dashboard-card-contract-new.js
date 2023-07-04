// Imports => React
import React, { useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS, ICONS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Import => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  OVERVIEW: {
    NEWCARD: 'ac-dashboard-card__new-card',
    NEWTITLE: 'ac-dashboard-card__new-title',
    NEWPARAGRAPH: 'ac-dashboard-card__new-paragraph',
    BUTTON: 'ac-dashboard-card__button',
    ICON: {
      ADD: 'ac-dashboard-card__add',
    },
  },
};

const AcDashboardCardNew = ({ store }) => {
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getDashboardNewCardClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.NEWCARD);
  }, []);

  const getNewTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.NEWTITLE);
  }, []);

  const getNewParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.NEWPARAGRAPH);
  }, []);

  const getAddIconClassNames = useMemo(() => {
    return clsx(_CLASSES.OVERVIEW.ICON.ADD);
  }, []);

  const redirectNewContract = () => {
    store.contracts.setCurrentLink('contracten');
    const redirect = ROUTES.NEWCONTRACT.path;
    history.push(redirect);
  };

  const getDashboardNewCardButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.ALPHA,
      variant: VARIANTS.NEWCARD,
      className: getDashboardNewCardClassNames,
      loading: is_loading,
      title: 'Nieuw Contract',
      callback: redirectNewContract,
    };
  }, []);

  const renderDashboardCards = useMemo(() => {
    return (
      <AcButton {...getDashboardNewCardButtonOptions}>
        <h4 className={getNewTitleClassNames}>
          <AcIcon icon={ICONS.ADD} className={getAddIconClassNames} />
        </h4>
        <p className={getNewParagraphClassNames}>Nieuw Contract</p>
      </AcButton>
    );
  }, []);

  return renderDashboardCards;
};

export default withRouter(withStore(observer(AcDashboardCardNew)));
