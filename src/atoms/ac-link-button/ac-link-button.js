// Imports => React
import React, { useEffect, useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, VARIANTS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';

const _CLASSES = {
  MAIN: 'ac-link-button',
  LINK: 'ac-link-button__link',
};

const AcLinkButton = ({ store }) => {
  const { is_loading } = store.auth;
  const button_id = AcUUID();
  const history = useHistory();
  const getMainButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.MAIN);
  }, []);

  const redirectOverview = () => {
    const redirect = ROUTES.CONTRACTOVERVIEW.path;
    history.push(redirect);
  };

  const getLinkButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      variant: VARIANTS.EDIT,
      loading: is_loading,
      title: 'Bekijk overzicht van alle contracten',
      callback: redirectOverview,
    };
  }, []);

  const renderLinkButton = useMemo(() => {
    return (
      <AcButton {...getLinkButtonOptions}>
        Bekijk overzicht van alle contracten
      </AcButton>
    );
  });

  return <div className={getMainButtonClassNames}>{renderLinkButton}</div>;
};

export default withRouter(withStore(observer(AcLinkButton)));
