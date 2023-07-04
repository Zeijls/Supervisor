// Imports => React
import React, { useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  BLOCK: {
    MAIN: 'ac-infoCard-block',
    TITLE: 'ac-infoCard-block__title',
    INFOBLOCK: 'ac-infoCard-block__infoblock',
    ITEM: 'ac-infoCard-block__item',
    LABEL: 'ac-infoCard-block__label',
    PARAGRAPH: 'ac-infoCard-block__paragraph',
  },
};

const AcContractInfo = ({ match, fields }) => {
  const { id } = match.params;

  const getBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.MAIN);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.TITLE);
  }, []);

  const getInfoBlockClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.INFOBLOCK);
  }, []);

  const getInfoItemClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.ITEM);
  }, []);

  const getLabelClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.LABEL);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.BLOCK.PARAGRAPH);
  }, []);

  const checkContracts = () => {
    if (fields && fields.name) {
      return (
        <div className={getBlockClassNames}>
          {fields && (
            <div className={getInfoBlockClassNames}>
              <div className={getInfoItemClassNames}>
                <h4 className={getLabelClassNames}>Contractnaam</h4>
                <h4 className={getLabelClassNames}>Begindatum</h4>
                <h4 className={getLabelClassNames}>Einddatum</h4>
                <h4 className={getLabelClassNames}>Kosten</h4>
                <h4 className={getLabelClassNames}>Uren</h4>
              </div>
              <div className={getInfoItemClassNames}>
                <p className={getParagraphClassNames}>{fields.name}</p>
                <p className={getParagraphClassNames}>{fields.starts_at}</p>
                <p className={getParagraphClassNames}>{fields.ends_at}</p>
                <p className={getParagraphClassNames}>{fields.costs}</p>
                <p className={getParagraphClassNames}>{fields.hours}</p>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  };

  const renderContractInfo = useMemo(() => {
    if (!checkContracts()) {
      return (
        <div className={getBlockClassNames}>
          <div className={getInfoItemClassNames}>
            <p className={getParagraphClassNames}>Geen Contracten</p>
          </div>
        </div>
      );
    } else {
      return checkContracts();
    }
  }, [fields, id]);

  return <div>{renderContractInfo}</div>;
};

export default withRouter(withStore(observer(AcContractInfo)));
