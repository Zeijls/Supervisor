// Imports => React
import React, { useMemo, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

// Imports => Constants
import { ROUTES } from '@constants';

// Imports => Molecules
import AcDragAndDrop from '@molecules/ac-drag-and-drop/ac-drag-and-drop';

// Imports => Atoms
import AcContractInfo from '@atoms/ac-contract-info/ac-contract-info';
import AcUpdatebutton from '@atoms/ac-updatebutton/ac-updatebutton';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  INFOCARD: {
    DRAGANDDROP: 'ac-drag-and-drop',
    BLOCK: 'ac-infoCard-block',
    TITLE: 'ac-infoCard-block__title',
    ITEM: 'ac-infoCard-block__item',
  },
};

const AcSlaInfo = ({ fields, match, store }) => {
  const { id } = match.params;

  const getDragAndDropClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.DRAGANDDROP);
  }, []);

  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.BLOCK);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.TITLE);
  }, []);

  const getInfoItemClassNames = useMemo(() => {
    return clsx(_CLASSES.INFOCARD.ITEM);
  }, []);

  const handleDrop = (files) => {
    let formData = new FormData();

    formData.append('file', files[0]);
    for (let key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
    }
    return store.media.store(formData, id).then(() => {
      store.contracts.show(id);
    });
  };

  const renderSLATitle = useMemo(() => {
    return <h5 className={getTitleClassNames}>Service Level Agreement</h5>;
  });

  const renderSLAInfo = useMemo(() => {
    return (
      <div className={getInfoItemClassNames}>
        <AcDragAndDrop
          onDrop={handleDrop}
          onBrowse={handleDrop}
          fields={fields}
        ></AcDragAndDrop>
      </div>
    );
  });

  return (
    <div className={getBlockClassNames}>
      {renderSLATitle}
      {renderSLAInfo}
    </div>
  );
};

export default withRouter(withStore(observer(AcSlaInfo)));
