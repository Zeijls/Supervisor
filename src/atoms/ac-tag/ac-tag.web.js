import React, { useMemo, memo } from 'react';
import clsx from 'clsx';

const _CLASSES = {
	MAIN: 'ac-tag',
	WHITE: 'ac-tag--white',
	OMEGA: 'ac-tag--omega',
};

const AcTag = ({ theme, label }) => {
	const getMainClassNames = useMemo(() => {
		return clsx(_CLASSES.MAIN, theme && _CLASSES[theme.toUpperCase()]);
	}, [theme]);

	return (
		<div
			className={getMainClassNames}
			dangerouslySetInnerHTML={{
				__html: label,
			}}
		/>
	);
};

export default memo(AcTag);
