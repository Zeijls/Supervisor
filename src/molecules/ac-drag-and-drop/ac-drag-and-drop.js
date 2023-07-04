// Imports => React
import React, { useMemo, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';

// Imports => Constants
import { ROUTES, ICONS, THEMES, VARIANTS } from '@constants';

// // Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Atoms
import AcButton from '@atoms/ac-button/ac-button';
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
  DRAG: {
    ANDDROP: 'ac-drag-and-drop',
    ZONE: 'ac-drag-and-drop__zone',
    ZONE_ACTIVE: 'ac-drag-and-drop__zone--active',
    ITEMS: 'ac-drag-and-drop__items',
    PARAGRAPH: 'ac-drag-and-drop__paragraph',
    ICON: 'ac-drag-and-drop__icon',
    BROWSE: 'ac-drag-and-drop__browse',
  },
  BUTTON: {
    LINK: 'ac-buttons__link',
  },
};

const AcDragAndDrop = ({ store, onDrop, onBrowse, fields, match }) => {
  const { id } = match.params;
  const history = useHistory();

  const getDragAndDropClassNames = useMemo(() => {
    return clsx(_CLASSES.DRAG.ANDDROP);
  }, []);

  const getLinkButtonClassNames = useMemo(() => {
    return clsx(_CLASSES.BUTTON.LINK);
  }, []);

  const getItemClassNames = useMemo(() => {
    return clsx(_CLASSES.DRAG.ITEMS);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.DRAG.PARAGRAPH);
  }, []);

  const getIconClassNames = useMemo(() => {
    return clsx(_CLASSES.DRAG.ICON);
  }, []);

  const getBrowseFileClassNames = useMemo(() => {
    return clsx(_CLASSES.DRAG.BROWSE);
  }, []);

  const handleDrop = async (event) => {
    if (event && event.persist) event.persist();
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      await onDrop(event.dataTransfer.files);
      await event.dataTransfer.clearData();
    }

    return redirectDrag();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  const getZoneClassNames = useMemo(() => {
    return clsx(_CLASSES.DRAG.ZONE, isDragActive && _CLASSES.DRAG.ZONE_ACTIVE);
  }, [isDragActive]);

  const handleBrowse = async (event) => {
    if (event && event.persist) event.persist();
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    const fileList = event.target.files;

    if (fileList && fileList.length > 0) {
      await onDrop(event.target.files);
    }

    return redirectDrag;
  };

  const redirectDrag = () => {
    const redirect = ROUTES.CONTRACTDETAIL.path.replace(':id?', id);
    history.push(redirect);
  };

  const renderMedia = useMemo(() => {
    if (fields && fields.media[0]) {
      const file = fields.media[0].file_name;
      return (
        <div className={getItemClassNames}>
          <p className={getParagraphClassNames}>{file}</p>
          <AcButton
            className={getLinkButtonClassNames}
            onClick={(event) => removeMediaItem(fields.media[0].id)}
          >
            Verwijder
          </AcButton>
        </div>
      );
    } else {
      return (
        <div className={getItemClassNames}>
          <p className={getParagraphClassNames}>
            <AcIcon icon={ICONS.PDF} className={getIconClassNames} />
            Drag & drop or
            <input
              type="file"
              id="file-selector"
              accept=".jpg, .jpeg, .png, .pdf"
              className={getBrowseFileClassNames}
              onChange={handleBrowse}
            />
          </p>
        </div>
      );
    }
  }, [isDragActive, fields]);

  const removeMediaItem = async (media_id) => {
    const contract_id = id;
    await store.media.delete(contract_id, media_id);
    return store.media.index();
    return redirectDrag();
  };

  return (
    <div
      className={getDragAndDropClassNames}
      {...getRootProps()}
      onDrop={(event) => handleDrop(event)}
    >
      <div className={getZoneClassNames}>
        <input {...getInputProps()} type="text" />
        {renderMedia}
      </div>
    </div>
  );
};

export default withRouter(withStore(observer(AcDragAndDrop)));
