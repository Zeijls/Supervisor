// Imports => React
import React, { useRef, useCallback, useEffect, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

// Imports => Constants
import {
  DATETIME_FORMATS,
  ICONS,
  KEYS,
  SIZES,
  THEMES,
  TYPES,
} from '@constants';

// Imports => Utilities
import {
  AcUUID,
  AcIsSet,
  AcIsUndefined,
  AcIsString,
  AcIsArray,
  AcIsObject,
  AcCapitalize,
  AcGetPagination,
  // AcFormatInternalURI,
  // AcFormatRole,
  // AcFormatCountry,
  AcGetClosestElement,
  // AcGetEquipmentIcon,
  AcFormatDate,
} from '@utils';

// Imports => Components
// import AcTableContextualMenu from '@components/ac-table-contextual-menu/ac-table-contextual-menu.web';

// Imports => Atoms
import AcIcon from '@atoms/ac-icon/ac-icon.web';
import AcRipple from '@atoms/ac-ripple/ac-ripple.web';

const _CLASSES = {
  TABLE: {
    MAIN: 'ac-table',
    WRP: 'ac-table-wrp',
    WIDE: 'ac-table-wrp--wide',
    HEAD: 'ac-table__head',
    BODY: 'ac-table__body',
    FOOTER: 'ac-table__footer',
    ROW: 'ac-table__row',
    CELL: {
      MAIN: 'ac-table__cell',
      HEAD: 'ac-table__cell--head',
      SORTABLE: 'ac-table__cell--sortable',
      SORTED: {
        MAIN: 'ac-table__cell--sorted',
        ASCENDING: 'ac-table__cell--ascending',
        DESCENDING: 'ac-table__cell--descending',
      },
      ACTION: 'ac-table__cell--action',
      GROW: 'ac-table__cell--grow-',
      CONTENT: 'ac-table__cell__content',
      CONTENT_WRP: 'ac-table__cell__content-wrp',
    },
    SORT: {
      MAIN: 'ac-table__sort',
      WRP: 'ac-table__sort-wrp',
      ICON: 'ac-table__sort__icon',
      ASCENDING: 'ac-table__sort__icon--ascending',
      DESCENDING: 'ac-table__sort__icon--descending',
    },
    PAGINATION: {
      MAIN: 'ac-table__pagination',
      TOTAL: 'ac-table__pagination__total',
      CONTROLS: {
        MAIN: 'ac-table__pagination__controls',
        ACTION: 'ac-table__pagination__action',
        PREVIOUS: 'ac-table__pagination__action--previous',
        NEXT: 'ac-table__pagination__action--next',
        ICON: 'ac-table__pagination__icon',
      },
    },
    PAGES: {
      NUMBERS: 'ac-table__pagination__numbers',
      NUMBER: 'ac-table__pagination__number',
      CURRENT: 'ac-table__pagination__number--current',
      SEPARATOR: 'ac-table__pagination__number--separator',
    },
  },
};

let timer = null;

const AcTablePageNumber = memo(({ num, current, callback, className }) => {
  const handleClick = (event) => {
    if (callback) callback();
  };

  return (
    <span className={className} onClick={handleClick}>
      {num}
      <AcRipple theme={THEMES.WHITE} size={SIZES.SMALL} simple />
    </span>
  );
});

const AcTable = ({
  columns = [],
  rows = [],
  pagination = {
    total: 0,
    current: 0,
    size: 15,
    pages: 0,
    callback: undefined,
  },
  sortby,
  onSort,
  onPaginate,
  onDownload,
  onRowClick,
  wide = false,
  actions = null,
  withIcon = false,
}) => {
  // const { t } = useTranslation();

  let $table = useRef(null);
  let $head = useRef(null);
  let $body = useRef(null);
  let $foot = useRef(null);

  useEffect(() => {
    if (timer) clearTimeout(timer);
    addEvents();
    calculateCellWidths();

    return () => {
      removeEvents();
    };
  }, [pagination]);

  const addEvents = () => {
    document.addEventListener('keyup', handleKeyUp, false);
  };

  const removeEvents = () => {
    if (timer) clearTimeout(timer);
    document.removeEventListener('keyup', handleKeyUp, false);
  };

  const handleKeyUp = (event) => {
    if (event && event.persist) event.persist();
    const key = event.key || event.which;

    const $active_element = document.activeElement;

    const $inputs = ['input', 'select', 'button', 'textarea', 'form'];

    if (key) {
      if (
        $active_element &&
        $inputs.indexOf($active_element.tagName.toLowerCase()) === -1
      ) {
        switch (key) {
          case 'ArrowLeft':
          case 37:
            handlePrevious();
            break;

          case 'ArrowRight':
          case 39:
            handleNext();
            break;

          default:
        }
      }
    }
  };

  const handleDownload = (event, link) => {
    if (event && event.persist) event.persist();
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    if (!AcIsSet(link) || !AcIsSet(link.entity)) return;

    let options = {};

    switch (link.entity) {
      case 'pdf-record':
      case 'pdf':
        options.pdf = true;
        break;
      case 'csv-record':
      case 'csv':
        options.csv = true;
        break;
      case 'xls-record':
      case 'xls':
        options.xls = true;
        break;

      default:
    }

    if (onDownload) onDownload(link, options);
  };

  const handleSort = (event, column) => {
    if (event && event.persist) event.persist();
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();

    if (!AcIsSet(column)) return;
    if (!AcIsSet(column.sortable)) return;

    if (onSort) onSort(column.key);
  };

  const handleRowClick = (event, object) => {
    if (onRowClick) onRowClick(object);
  };

  const handlePageClick = useCallback(
    (num) => {
      if (!AcIsSet(pagination)) return;
      if (onPaginate && num !== pagination.current_page) {
        onPaginate(num);
      }
    },
    [onPaginate, pagination]
  );

  const handlePrevious = useCallback(
    (event) => {
      if (!AcIsSet(pagination)) return;
      if (pagination.current_page === 1) return;

      const current = pagination.current_page;
      const previous = current - 1;

      if (onPaginate && previous >= 1) {
        onPaginate(previous);
      }
    },
    [onPaginate, pagination]
  );

  const handleNext = useCallback(
    (event) => {
      if (!AcIsSet(pagination)) return;
      if (pagination.current_page === pagination.last_page) return;

      const current = pagination.current_page;
      const next = current + 1;

      if (onPaginate && next <= pagination.last_page) {
        onPaginate(next);
      }
    },
    [onPaginate, pagination]
  );

  const calculateCellWidths = useCallback(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const $tablebody = $body && $body.current;

      if (!AcIsSet($tablebody)) {
        calculateCellWidths();
        return;
      }

      const $rows = $tablebody.querySelectorAll(`.${_CLASSES.TABLE.ROW}`);

      const len = $rows.length;
      let n = 0;

      let cell_widths = [];

      for (n; n < len; n++) {
        const $row = $rows[n];
        const rowrect = $row.getBoundingClientRect();
        const $cells = $row.querySelectorAll(`.${_CLASSES.TABLE.CELL.MAIN}`);

        const clen = $cells.length;
        let x = 0;
        let max_cell_width = rowrect.width / clen / 10;

        for (x; x < clen; x++) {
          const $cell = $cells[x];
          const rect = $cell.getBoundingClientRect();

          let width = rect.width / 10;
          width = width > max_cell_width ? max_cell_width : width;

          if (!AcIsSet(cell_widths[x])) {
            cell_widths.push(width);
          } else if (cell_widths[x] && width > cell_widths[x]) {
            cell_widths[x] = width;
          }
        }
      }

      window.requestAnimationFrame(() => setWidths(cell_widths));

      return cell_widths;
    }, 300);
  }, [$body, columns]);

  const setWidths = useCallback(
    (widths) => {
      const $tablebody = $body && $body.current;
      const $tablehead = $head && $head.current;

      if (!AcIsSet($tablebody) || !AcIsSet($tablehead)) return;

      const $hcells = $tablehead.querySelectorAll(
        `.${_CLASSES.TABLE.CELL.MAIN}`
      );
      const $rows = $tablebody.querySelectorAll(`.${_CLASSES.TABLE.ROW}`);

      const hlen = $hcells.length;
      let b = 0;

      for (b; b < hlen; b++) {
        const $hcell = $hcells[b];

        if (AcIsSet(widths[b])) {
          $hcell.style.width = `${widths[b]}rem`;
        }
      }

      const len = $rows.length;
      let n = 0;

      for (n; n < len; n++) {
        const $row = $rows[n];
        const $cells = $row.querySelectorAll(`.${_CLASSES.TABLE.CELL.MAIN}`);

        const clen = $cells.length;
        let x = 0;

        for (x; x < clen; x++) {
          const $cell = $cells[x];

          if (AcIsSet(widths[x])) $cell.style.width = `${widths[x]}rem`;
        }
      }

      return widths;
    },
    [$head, $body]
  );

  const calculateWidth = (event) => {
    if (!AcIsSet(event) || !AcIsSet(event.target)) return;
    if (event.persist) event.persist();

    const target = event.target.classList.contains(_CLASSES.TABLE.CELL.CONTENT)
      ? event.target
      : AcGetClosestElement(event.target, `.${_CLASSES.TABLE.CELL.CONTENT}`);

    if (!AcIsSet(target)) return;

    let width = (target.scrollWidth + 1) / 10;
    width = width > 50 ? 50 : width;
    target.style.maxWidth = `${width}rem`;
  };

  const resetWidth = (event) => {
    if (!AcIsSet(event) || !AcIsSet(event.target)) return;
    if (event.persist) event.persist();

    const target = event.target.classList.contains(_CLASSES.TABLE.CELL.CONTENT)
      ? event.target
      : AcGetClosestElement(event.target, `.${_CLASSES.TABLE.CELL.CONTENT}`);

    if (!AcIsSet(target)) return;

    target.style.maxWidth = '';
  };

  const getTableCellContentClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.CELL.CONTENT);
  }, []);

  const getTableCellContentWrpClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.CELL.CONTENT_WRP);
  }, []);

  const getTableActionCellClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.CELL.MAIN, _CLASSES.TABLE.CELL.ACTION);
  }, []);

  const getTableBodyCellClassNames = useCallback((_size) => {
    return clsx(
      _CLASSES.TABLE.CELL.MAIN,
      _size && `${_CLASSES.TABLE.CELL.GROW}${_size}`
    );
  }, []);

  const getTableHeadSortIconClassNames = useCallback((direction) => {
    return clsx(
      _CLASSES.TABLE.SORT.ICON,
      direction === KEYS.ASCENDING && _CLASSES.TABLE.SORT.ASCENDING,
      direction === KEYS.DESCENDING && _CLASSES.TABLE.SORT.DESCENDING
    );
  }, []);

  const getTableHeadSortIconWrpClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.SORT.MAIN, _CLASSES.TABLE.SORT.WRP);
  }, []);

  const getTableHeadActionCellClassNames = useMemo(() => {
    return clsx(
      _CLASSES.TABLE.CELL.MAIN,
      _CLASSES.TABLE.CELL.HEAD,
      _CLASSES.TABLE.CELL.ACTION
    );
  }, []);

  const getTableHeadCellClassNames = useCallback(
    (_sortable, _sortkey) => {
      const _sorted = sortby && _sortkey === sortby.field;
      const _direction = sortby && _sorted && sortby.direction;

      return clsx(
        _CLASSES.TABLE.CELL.MAIN,
        _CLASSES.TABLE.CELL.HEAD,
        _sortable && _CLASSES.TABLE.CELL.SORTABLE,
        _sorted && _CLASSES.TABLE.CELL.SORTED.MAIN,
        _direction === KEYS.ASCENDING && _CLASSES.TABLE.CELL.SORTED.ASCENDING,
        _direction === KEYS.DESCENDING && _CLASSES.TABLE.CELL.SORTED.DESCENDING
      );
    },
    [sortby, pagination]
  );

  const getTableRowClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.ROW);
  }, []);

  const getTablePaginationControlsPageNumberClassNames = useCallback(
    (current = false, separator = false) => {
      return clsx(
        _CLASSES.TABLE.PAGES.NUMBER,
        current && _CLASSES.TABLE.PAGES.CURRENT,
        separator && _CLASSES.TABLE.PAGES.SEPARATOR
      );
    },
    []
  );

  const getTablePaginationControlsPageNumbersClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.PAGES.NUMBERS);
  }, []);

  const getTablePaginationControlsActionIconClassNames = useCallback(() => {
    return clsx(_CLASSES.TABLE.PAGINATION.CONTROLS.ICON);
  }, []);

  const getTablePaginationControlsActionClassNames = useCallback(
    (direction) => {
      return clsx(
        _CLASSES.TABLE.PAGINATION.CONTROLS.ACTION,
        direction === KEYS.PREVIOUS &&
          _CLASSES.TABLE.PAGINATION.CONTROLS.PREVIOUS,
        direction === KEYS.NEXT && _CLASSES.TABLE.PAGINATION.CONTROLS.NEXT
      );
    },
    []
  );

  const getTablePaginationControlsClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.PAGINATION.CONTROLS.MAIN);
  }, []);

  const getTablePaginationTotalClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.PAGINATION.TOTAL);
  }, []);

  const getTablePaginationClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.PAGINATION.MAIN);
  }, []);

  const getTableFooterClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.FOOTER);
  }, []);

  const getTableBodyClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.BODY);
  }, []);

  const getTableHeadClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.HEAD);
  }, []);

  const getTableClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.MAIN);
  }, []);

  const getTableWrpClassNames = useMemo(() => {
    return clsx(_CLASSES.TABLE.WRP, wide && _CLASSES.TABLE.WIDE);
  }, [wide]);

  const getCellValue = useCallback((row, key) => {
    if (!row) return '-';
    if (!key) return row;

    let result = null;

    if (AcIsObject(row)) {
      if (AcIsSet(row[key])) result = { value: row[key] };
    } else {
      const len = row.length;
      let n = 0;

      for (n; n < len; n++) {
        const item = row[n];
        const item_key =
          AcIsArray(item) && item[0] && item[0].key
            ? item[0].key
            : item && item.key
            ? item.key
            : null;

        if (item_key === key) {
          result = item;
          break;
        }
      }
    }

    return result;
  }, []);

  const formatSingleValue = (input, type, format) => {
    let result = input;
    let value, name, link;

    if (AcIsObject(input)) {
      if (!AcIsUndefined(input.value) || !AcIsUndefined(input.name)) {
        value = input.value;
        name = input.name;
        link = input.link;
        if (AcIsObject(value)) {
          value = value.name || value.group || '-';
        }
        result = value || name || '-';
      }
    }

    let _format = format;

    switch (type) {
      case 'date':
        if (!_format)
          _format = {
            from: DATETIME_FORMATS.RAW_DATE,
            to: DATETIME_FORMATS.DATE,
          };
        result = AcFormatDate(result, _format.from, _format.to);
        break;

      case 'starts_at':
      case 'ends_at':
        if (!_format)
          _format = {
            from: DATETIME_FORMATS.DATE,
            to: DATETIME_FORMATS.DATE,
          };
        result = AcFormatDate(result, _format.from, _format.to);
        break;

      case 'piling_date':
        if (!_format)
          _format = {
            from: DATETIME_FORMATS.RAW_DATETIME_WITH_YEAR_REVERSE,
            to: DATETIME_FORMATS.RAW_DATETIME_WITH_YEAR,
          };
        result = AcFormatDate(result, _format.from, _format.to);
        break;

      // case 'role':
      // case 'roles':
      //   result = AcFormatRole(result);
      //   break;

      // case 'country_code':
      //   result = AcFormatCountry(result);
      //   break;

      default:
    }

    if (AcIsString(result)) {
      result =
        [TYPES.EMAIL, TYPES.WEBSITE].indexOf(type) === -1
          ? AcCapitalize(result)
          : result;
    }

    // if (AcIsSet(link) && link.id && link.active) {
    //   let route = AcFormatInternalURI(link, value);
    //   if (
    //     link.entity &&
    //     (link.entity === 'pdf-record' ||
    //       link.entity === 'csv-record' ||
    //       link.entity === 'xls-record')
    //   ) {
    //     result = (
    //       <a
    //         href={'download'}
    //         key={`link-${link.id}`}
    //         onClick={(event) => handleDownload(event, link)}
    //       >
    //         {value}
    //       </a>
    //     );
    //   } else {
    //     result = (
    //       <Link key={`link-${link.id}`} to={route}>
    //         {value}
    //       </Link>
    //     );
    //   }
    // }

    return result;
  };

  const formatCellValue = useCallback((cell, type, format) => {
    if (!cell) return '-';

    const { value } = cell;
    let result = value;

    if (AcIsArray(cell) || AcIsArray(value)) {
      const collection = AcIsArray(cell) ? cell : value;
      const len = collection.length;
      let n = 0;
      result = [];

      for (n; n < len; n++) {
        const item = collection[n];
        const val = formatSingleValue(item, type, format);
        result.push(val);
      }

      if (result && result[0] && !AcIsObject(result[0]))
        result = result.join('<br/>');
    } else {
      result = formatSingleValue(cell, type, format);

      // if (withIcon && AcIsSet(format) && type === KEYS.OBJECT_NO) {
      //   const icon = AcGetEquipmentIcon(format);
      //   if (AcIsSet(icon))
      //     result = [
      //       <i
      //         key={`ac-icon-${AcUUID()}`}
      //         className={`ac-icon ac-icon--${icon}`}
      //       />,
      //       result,
      //     ];
      // }
    }

    return result;
  }, []);

  const renderTableHeader = useMemo(() => {
    if (!columns) return null;

    const len = columns.length;
    let n = 0;
    let result = [];

    for (n; n < len; n++) {
      const item = columns[n];
      if (item.visible) {
        const object = (
          <div
            key={`column-${n}-${item.key}`}
            className={getTableHeadCellClassNames(item.sortable, item.key)}
            onClick={(event) => {
              if (item.sortable) handleSort(event, item);
            }}
          >
            {item.sortable && (
              <span className={getTableHeadSortIconWrpClassNames}>
                <AcIcon
                  icon={ICONS.ARROW_UP}
                  className={getTableHeadSortIconClassNames(KEYS.DESCENDING)}
                />
                <AcIcon
                  icon={ICONS.ARROW_DOWN}
                  className={getTableHeadSortIconClassNames(KEYS.ASCENDING)}
                />
              </span>
            )}
            {item.label}
          </div>
        );
        result.push(object);
      }
    }

    return (
      <div className={getTableHeadClassNames} ref={$head}>
        <div className={getTableRowClassNames}>
          {result}
          {actions && <div className={getTableHeadActionCellClassNames} />}
        </div>
      </div>
    );
  }, [columns]);

  const renderTableBody = useMemo(() => {
    if (!rows || !columns) return null;

    const { current_page } = pagination || { current_page: 1 };
    let key = `${current_page}`;

    if (sortby) {
      const { field, direction } = sortby;
      key = `${key}-${field}-${direction}`;
    }

    const len = rows.length;
    let n = 0;
    let result = [];

    const clen = columns.length;
    let cn = 0;

    for (n; n < len; n++) {
      const row = rows[n];
      let nrow = [];

      cn = 0;
      for (cn; cn < clen; cn++) {
        const column = columns[cn];

        if (column.visible) {
          const cell = getCellValue(row, column.key);
          const group = getCellValue(row, 'type_name');
          const value = formatCellValue(
            cell,
            column.key,
            (row && row.equipment_group) || (group && group.value)
          );
          const object = (
            <div
              key={`cell-${n}-${column.key}`}
              className={getTableBodyCellClassNames(column.size)}
              aria-label={value && value}
              onClick={(event) => handleRowClick(event, row)}
            >
              {AcIsString(value) && (
                <>
                  <div
                    className={getTableCellContentWrpClassNames}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${value}</span>`,
                    }}
                  />
                  <div
                    className={getTableCellContentClassNames}
                    onMouseOver={calculateWidth}
                    onMouseOut={resetWidth}
                    dangerouslySetInnerHTML={{
                      __html: `<span>${value}</span>`,
                    }}
                  />
                </>
              )}
              {!AcIsString(value) && (
                <>
                  <div className={getTableCellContentWrpClassNames}>
                    <span>{value}</span>
                  </div>
                  <div
                    className={getTableCellContentClassNames}
                    onMouseOver={calculateWidth}
                    onMouseOut={resetWidth}
                  >
                    <span>{value}</span>
                  </div>
                </>
              )}
            </div>
          );
          nrow.push(object);
        }
      }

      // if (actions) {
      //   nrow.push(
      //     <div
      //       key={`cell-${n}-row-action`}
      //       className={getTableActionCellClassNames}
      //     >
      //       <AcTableContextualMenu
      //         id={`n-cm-${n}`}
      //         data={row}
      //         actions={actions}
      //       />
      //     </div>
      //   );
      // }

      const row_element = (
        <div key={`row-${AcUUID()}`} className={getTableRowClassNames}>
          {nrow}
        </div>
      );
      result.push(row_element);
    }

    return (
      <div className={getTableBodyClassNames} key={key} ref={$body}>
        {result}
      </div>
    );
  }, [columns, rows, pagination, sortby]);

  const renderPageNumbers = useCallback(
    (pages, current_page) => {
      if (!AcIsSet(pages)) return null;

      const pagination = AcGetPagination(current_page, {
        range: 3,
        pages,
      });

      let result = [];

      let has_first_page = pagination.find((item) => item.num === 1);
      let has_last_page = pagination.find((item) => item.num === pages);

      if (!has_first_page) {
        result.push(
          <AcTablePageNumber
            num={1}
            key={'ac-table-page-number-1'}
            callback={() => {
              handlePageClick(1);
            }}
            className={getTablePaginationControlsPageNumberClassNames()}
          />
        );

        if (pagination[0].num - 1 > 1) {
          result.push(
            <span
              key={'ac-table-page-number-separator-1'}
              className={getTablePaginationControlsPageNumberClassNames(
                null,
                true
              )}
            >
              ...
            </span>
          );
        }
      }

      let n = 0;
      let len = pagination.length;

      for (n; n < len; n++) {
        const item = pagination[n];
        result.push(
          <AcTablePageNumber
            {...item}
            key={`ac-table-page-number-${item.num}`}
            callback={() => {
              handlePageClick(item.num);
            }}
            className={getTablePaginationControlsPageNumberClassNames(
              item.current
            )}
          />
        );
      }

      if (!has_last_page) {
        if (pagination[pagination.length - 1].num + 1 < pages) {
          result.push(
            <span
              key={`ac-table-page-number-separator-${pages}`}
              className={getTablePaginationControlsPageNumberClassNames(
                null,
                true
              )}
            >
              ...
            </span>
          );
        }
        result.push(
          <AcTablePageNumber
            num={pages}
            key={`ac-table-page-number-${pages}`}
            callback={() => {
              handlePageClick(pages);
            }}
            className={getTablePaginationControlsPageNumberClassNames()}
          />
        );
      }

      return result;
    },
    [pagination]
  );

  const renderTablePagination = useMemo(() => {
    if (!AcIsSet(pagination)) return null;

    const { total, current_page, last_page } = pagination;
    const current = {
      min: pagination.from || 0,
      max: pagination.to || 0,
      total: total || 0,
    };
    const total_results = `<strong>${current.min}</strong> - <strong>${current.max}</strong> out of <strong>${current.total}</strong> results`;

    return (
      <div className={getTableFooterClassNames} ref={$foot}>
        <div className={getTableRowClassNames}>
          <div className={getTablePaginationClassNames}>
            <div
              className={getTablePaginationTotalClassNames}
              key={JSON.stringify(current)}
              dangerouslySetInnerHTML={{
                __html: total_results,
              }}
            />

            <div className={getTablePaginationControlsClassNames}>
              <div
                className={getTablePaginationControlsActionClassNames(
                  KEYS.PREVIOUS
                )}
                disabled={current_page === 1}
                onClick={handlePrevious}
              >
                <AcIcon
                  icon={ICONS.ARROW_LEFT}
                  className={getTablePaginationControlsActionIconClassNames}
                />
              </div>

              <div className={getTablePaginationControlsPageNumbersClassNames}>
                {renderPageNumbers(last_page, current_page)}
              </div>

              <div
                className={getTablePaginationControlsActionClassNames(
                  KEYS.NEXT
                )}
                disabled={current_page === last_page}
                onClick={handleNext}
              >
                <AcIcon
                  icon={ICONS.ARROW_RIGHT}
                  className={getTablePaginationControlsActionIconClassNames}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [pagination]);

  return (
    <div className={getTableWrpClassNames}>
      <div className={getTableClassNames} ref={$table}>
        {renderTableHeader}
        {renderTableBody}
        {renderTablePagination}
      </div>
    </div>
  );
};

export default memo(AcTable);
