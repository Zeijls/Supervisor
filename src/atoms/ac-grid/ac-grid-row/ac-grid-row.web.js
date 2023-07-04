// Imports => React
import React, { useMemo, memo } from 'react';
import clsx from 'clsx';

// Imports => Utilities
import { AcUUID } from '@utils';

const _CLASSES = {
	MAIN: 'ac-row',
	NOGUTTERS: 'ac-row--no-gutters',
	FORM: 'ac-row--form',
};

// Component
const AcGridRow = ({
	id = AcUUID(),
	rel = 'ac-row',
	className,
	noGutters,
	form,
	children,
}) => {
	const getStyleClassNames = useMemo(() => {
		return clsx(
			_CLASSES.MAIN,
			noGutters && _CLASSES.NOGUTTERS,
			form && _CLASSES.FORM,
			className
		);
	}, [noGutters, form, className]);

	return (
		<div className={getStyleClassNames} id={id} rel={rel}>
			{children}
		</div>
	);
};

export default memo(AcGridRow);
