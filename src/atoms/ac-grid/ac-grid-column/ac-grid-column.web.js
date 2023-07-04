// Imports => React
import React, { useMemo, memo } from 'react';
import clsx from 'clsx';

// Imports => Utilities
import { AcUUID, AcIsObject } from '@utils';

const _CLASSES = {
	MAIN: 'ac-col',
	AUTO: 'ac-col--auto',
};

const colWidths = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'];

// Component
const AcGridCol = ({
	id = AcUUID(),
	widths = colWidths,
	className,
	children,
	...props
}) => {
	const getColClassNames = useMemo(() => {
		let colClasses = [];

		widths.forEach((colWidth, i) => {
			let columnProp = props[colWidth];

			if (!columnProp && columnProp !== '') {
				return;
			}

			const isXs = !i;

			if (AcIsObject(columnProp)) {
				const colSizeInterfix = isXs ? '-' : `-${colWidth}-`;
				const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);

				colClasses.push(
					clsx({
						[colClass]: columnProp.size || columnProp.size === '',
						[`order${colSizeInterfix}${columnProp.order}`]:
							columnProp.order || columnProp.order === 0,
						[`offset${colSizeInterfix}${columnProp.offset}`]:
							columnProp.offset || columnProp.offset === 0,
					})
				);
			} else {
				const colClass = getColumnSizeClass(isXs, colWidth, columnProp);
				colClasses.push(colClass);
			}
		});

		if (!colClasses.length) {
			colClasses.push(_CLASSES.MAIN);
		}

		return colClasses;
	}, [props, widths]);

	const getStyleClassNames = useMemo(() => {
		const colClasses = getColClassNames;

		return clsx(colClasses, className);
	}, [getColClassNames, className]);

	return (
		<div className={getStyleClassNames} id={id}>
			{children}
		</div>
	);
};

const getColumnSizeClass = (isXs, colWidth, colSize) => {
	if (colSize === true || colSize === '') {
		return isXs ? _CLASSES.MAIN : `${_CLASSES.MAIN}-${colWidth}`;
	} else if (colSize === 'auto') {
		return isXs ? _CLASSES.AUTO : `${_CLASSES.MAIN}-${colWidth}-auto`;
	}

	return isXs
		? `${_CLASSES.MAIN}-${colSize}`
		: `${_CLASSES.MAIN}-${colWidth}-${colSize}`;
};

export default memo(AcGridCol);
