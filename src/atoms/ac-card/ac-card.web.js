// Imports => React
import React, { forwardRef } from 'react';
import clsx from 'clsx';

const _CLASSES = {
	MAIN: 'ac-card',
	DEFAULT: 'ac-card--default',
	TRANSPARENT: 'ac-card--transparent',
	PLACEHOLDER: 'ac-card--placeholder',
	PATTERN: 'ac-card--pattern',
	WHITE: 'ac-card--white',
	LIGHT: 'ac-card--light',
	SUBTLE: 'ac-card--subtle',
	DARK: 'ac-card--dark',
	PITCH: 'ac-card--pitch',
	ALPHA: 'ac-card--alpha',
	OMEGA: 'ac-card--omega',
	ROUNDED: 'ac-card--rounded',
	RAISED: 'ac-card--raised',
	NO_ANIMATION: 'ac-card--no-animation',
	ALIGNMENT: {
		LEFT: 'ac-card--align-left',
		CENTER: 'ac-card--align-center',
		RIGHT: 'ac-card--align-right',
	},
};

// Component
const AcCard = forwardRef(
	(
		{
			id,
			theme = 'default',
			borderRadius = false,
			hoverAnimation = true,
			raised = false,
			alignment,
			width,
			height,
			className,
			children,
			callback,
			...rest
		},
		ref
	) => {
		const handleCallback = event => {
			if (callback) callback(event);
		};

		const getStyleClassNames = () => {
			return clsx(
				_CLASSES.MAIN,
				theme && _CLASSES[theme.toUpperCase()],
				borderRadius && _CLASSES.ROUNDED,
				!hoverAnimation && _CLASSES.NO_ANIMATION,
				alignment && _CLASSES.ALIGNMENT[alignment.toUpperCase()],
				raised && _CLASSES.RAISED,
				className
			);
		};

		const getInlineStyle = () => {
			return {
				width: width ? `${width / 10}rem` : undefined,
				height: height ? `${height / 10}rem` : undefined,
			};
		};

		return (
			<article
				id={id}
				className={getStyleClassNames()}
				style={getInlineStyle()}
				onClick={handleCallback}
				ref={ref}
				{...rest}
			>
				{children}
			</article>
		);
	}
);

export default React.memo(AcCard);
