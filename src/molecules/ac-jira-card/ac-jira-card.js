// Imports => React
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES, ICONS } from '@constants';

// Imports => Atoms
import AcContractsJira from '@atoms/ac-contracts-jira/ac-contracts-jira';
import AcUpdatebutton from '@atoms/ac-updatebutton/ac-updatebutton';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  INFOCARD: {
    MAIN: 'ac-infoCard',
    HEADER: 'ac-infoCard__header',
    TITLE: 'ac-infoCard__title',
    BODY: 'ac-infoCard__body',
    ICON: 'ac-client-card__icon',
  },
};

const AcJiraCard = ({ fields, id }) => {
  const history = useHistory();

  const getInfoCardClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.MAIN);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.TITLE);
  }, []);

  const getHeaderClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.HEADER);
  }, []);

  const getBodyClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.BODY);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.ICON);
  }, []);

  const handleSubmit = () => {
    if (fields && fields.applications[0]) {
      const id = fields.applications[0].id;

      const applicationId = ROUTES.UPDATEAPPLICATION.path.replace(':id?', id);
      history.push(applicationId);
    }
  };

  const renderHeader = useMemo(() => {
    return (
      <div className={getHeaderClassNames}>
        <h1 className={getTitleClassNames}>
          <AcIcon icon={ICONS.DIAMOND} className={getIconClassNames} /> JIRA
          projects
        </h1>
      </div>
    );
  });

  const renderBody = useMemo(() => {
    return (
      <div className={getBodyClassNames}>
        <AcContractsJira fields={fields} />
      </div>
    );
  });

  return (
    <div className={getInfoCardClassNames}>
      {renderHeader}
      {renderBody}
    </div>
  );
};

export default withStore(observer(AcJiraCard));
