// Imports => React
import React from 'react';
import clsx from 'clsx';

const _CLASSES = {
	MAIN: 'ac-divider',
	DEFAULT: 'ac-divider--default',
	WHITE: 'ac-divider--white',
	OFFWHITE: 'ac-divider--offwhite',
	LIGHT: 'ac-divider--light',
	SUBTLE: 'ac-divider--subtle',
	MEDIUM: 'ac-divider--medium',
	DARK: 'ac-divider--dark',
	PITCH: 'ac-divider--pitch',
	ALPHA: 'ac-divider--alpha',
	ALPHA_LIGHT: 'ac-divider--alpha-light',
	OMEGA: 'ac-divider--omega',
};

const AcDivider = ({ theme = 'default', className }) => {
	const getStyleClassNames = () => {
		return clsx(
			_CLASSES.MAIN,
			theme && _CLASSES[theme.toUpperCase()],
			className
		);
	};
	return <div className={getStyleClassNames()} />;
};

export default React.memo(AcDivider);
