// Imports => React
import React, { useMemo } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, THEMES, ICONS } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button.web';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  BLOCK: {
    MAIN: 'ac-infoCard-block',
    TITLE: 'ac-infoCard-block__title',
    INFOBLOCK: 'ac-infoCard-block__infoblock',
    ITEM: 'ac-infoCard-block__item',
    LABEL: 'ac-infoCard-block__label',
    PARAGRAPH: 'ac-infoCard-block__paragraph',
    BUTTONBLOCK: 'ac-infoCard-block__buttonblock',
    CIRCLE: 'ac-application-card__circle',
    ICON: 'ac-application-card__icon',
  },
};

const AcContractsJira = ({ match, store }) => {
  const { id } = match.params;
  const history = useHistory();
  const { is_loading } = store.auth;
  const button_id = AcUUID();

  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.MAIN);
  }, []);

  const getInfoZeroClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.INFOBLOCKZERO);
  }, []);

  const getCircleClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.CIRCLE);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.ICON);
  }, []);

  const getLinkButtonOptions = useMemo(() => {
    return {
      id: button_id,
      theme: THEMES.WHITE,
      loading: is_loading,
      title: 'Nieuw Contract',
      // callback: newApplication,
    };
  }, []);

  const renderJira = useMemo(() => {
    return (
      <div className={getBlockClassNames}>
        <div className={getInfoZeroClassNames}>
          <AcButton {...getLinkButtonOptions}>
            <div className={getCircleClassNames}>
              <AcIcon icon={ICONS.ADD} className={getIconClassNames} />
            </div>
            Voeg Jira toe
          </AcButton>
        </div>
      </div>
    );
  });

  return <div>{renderJira}</div>;
};

export default withRouter(withStore(observer(AcContractsJira)));
