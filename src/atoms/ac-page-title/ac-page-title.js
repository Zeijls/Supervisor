// Imports => React
import React, { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const _CLASSES = {
  MAIN: 'ac-page ac-home',
  HEADERS: {
    MAIN: 'ac-headers',
    TITLE: 'ac-headers__title',
    NAVIGATION: 'ac-headers__navigation',
    LINK: 'ac-headers__link',
    PARAGRAPH: 'ac-headers__paragraph',
  },
};

const AcPageTitle = ({ title, collection }) => {
  const getHeadersClassNames = useMemo(() => {
    return clsx(_CLASSES.HEADERS.MAIN);
  }, []);

  const getTitleClassNames = useMemo(() => {
    return clsx(_CLASSES.HEADERS.TITLE);
  }, []);

  const getNavigationClassNames = useMemo(() => {
    return clsx(_CLASSES.HEADERS.NAVIGATION);
  }, []);

  const getLinkClassNames = useMemo(() => {
    return clsx(_CLASSES.HEADERS.LINK);
  }, []);

  const getParagraphClassNames = useMemo(() => {
    return clsx(_CLASSES.HEADERS.PARAGRAPH);
  }, []);

  const renderTitle = useMemo(() => {
    if (!title) return null;

    return <h1 className={getTitleClassNames}>{title}</h1>;
  }, [title]);

  const renderCollection = useMemo(() => {
    if (!collection) return null;
    if (!collection.length) return null;

    const len = collection.length;
    let n = 0;
    let result = [];

    for (n; n < len; n++) {
      const item = collection[n];

      const { label, path } = item;
      const Tag = path ? Link : 'p';
      let props = {};

      if (path) {
        props.to = path;
        props.className = getLinkClassNames;
      } else {
        props.className = getParagraphClassNames;
      }

      const object = (
        <Tag key={label} {...props}>
          {label}
        </Tag>
      );

      result.push(object);
    }

    return <div className={getNavigationClassNames}>{result}</div>;
  }, [collection]);

  return (
    <div className={getHeadersClassNames}>
      {renderCollection}
      {renderTitle}
    </div>
  );
};

export default memo(AcPageTitle);
