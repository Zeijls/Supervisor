// Imports => React
import React, { useMemo, memo } from 'react';
import clsx from 'clsx';

const _CLASSES = {
	MAIN: 'ac-rich-content',
};

// Component
const AcRichContent = ({ content, className }) => {
	const getStyleClassNames = useMemo(() => {
		return clsx(_CLASSES.MAIN, className && className);
	}, [className]);

	return (
		<div
			className={getStyleClassNames}
			dangerouslySetInnerHTML={{
				__html: content,
			}}
		/>
	);
};

export default memo(AcRichContent);
