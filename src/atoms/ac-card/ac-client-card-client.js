// Imports => React
import React, { useMemo, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, ICONS, KEYS } from '@constants';

// Import Molecules
import AcFormClientUpdate from '@molecules/ac-form/ac-form-client-update';
import AcModal from '@molecules/ac-modal/ac-modal.web';

// Import => Atoms
import AcUpdatebutton from '@atoms/ac-updatebutton/ac-updatebutton';
import AcContractClients from '@atoms/ac-contract-clients/ac-contract-clients';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  DETAILCARD: {
    MAIN: 'ac-client-card',
    CARD: 'ac-client-card__card',
    HEADER: 'ac-client-card__header',
    TITLE: 'ac-client-card__title',
    BODY: 'ac-client-card__body',
    ICON: 'ac-client-card__icon',
  },
};

const AcClientCardClient = ({ id, store, current_client, onUpdate }) => {
  const getCardClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.CARD);
  }, []);

  const getHeaderClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.HEADER);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.TITLE);
  }, []);

  const getBodyClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.BODY);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.DETAILCARD.ICON);
  }, []);

  const handleClient = async (event, number, fields, id) => {
    if (event && event.preventDefault) event.preventDefault();
    if (onUpdate) onUpdate(number, fields, id);
  };

  const renderUpdatebutton = useMemo(() => {
    if (current_client) {
      return (
        <AcUpdatebutton onUpdate={handleClient} contract_id={id} id={id} />
      );
    } else {
      return null;
    }
  }, [current_client]);

  const renderHeader = useMemo(() => {
    if (current_client) {
      return (
        <div className={getHeaderClassNames}>
          <h1 className={getTitleClassNames}>
            <AcIcon icon={ICONS.PORTFOLIO} className={getIconClassNames} />
            Bedrijfsgegevens
          </h1>
          {renderUpdatebutton}
        </div>
      );
    } else {
      return (
        <div className={getHeaderClassNames}>
          <h1 className={getTitleClassNames}>
            <AcIcon icon={ICONS.PORTFOLIO} className={getIconClassNames} />
            Bedrijfsgegevens
          </h1>
        </div>
      );
    }
  });

  const renderBody = useMemo(() => {
    return (
      <div className={getBodyClassNames}>
        <AcContractClients current_client={current_client} id={id} />
      </div>
    );
  }, [current_client]);

  return (
    <div className={getCardClassNames}>
      {renderHeader}
      {renderBody}
    </div>
  );
};

export default withRouter(withStore(observer(AcClientCardClient)));
