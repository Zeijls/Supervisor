// Imports => React
import React, { useMemo } from 'react';
import clsx from 'clsx';

// Imports => Utilities
import { AcUUID } from '@utils';

const _CLASSES = {
	MAIN: 'ac-container',
	FLUID: 'ac-container--fluid',
};

// Component
const AcGridContainer = ({
	className,
	fluid,
	rel = 'ac-container',
	id = AcUUID(),
	children,
}) => {
	const getStyleClassNames = useMemo(() => {
		return clsx(!fluid && _CLASSES.MAIN, fluid && _CLASSES.FLUID, className);
	}, [fluid, className]);
	return (
		<div className={getStyleClassNames} id={id} rel={rel}>
			{children}
		</div>
	);
};

export default React.memo(AcGridContainer);
