// Imports => React
import React, { useMemo, memo } from 'react';
import clsx from 'clsx';

// Imports => Utilities
import { AcIsSet, AcIsString, AcIsArray, AcIsObject } from '@utils';

const _CLASSES = {
	MAIN: 'ac-heading',
	H1: 'ac-heading--h1',
	H2: 'ac-heading--h2',
	H3: 'ac-heading--h3',
	H4: 'ac-heading--h4',
	H5: 'ac-heading--h5',
	H6: 'ac-heading--h6',
	H7: 'ac-heading--h7',
	DEFAULT: 'ac-heading--default',
	WHITE: 'ac-heading--white',
	LIGHT: 'ac-heading--light',
	SUBTLE: 'ac-heading--subtle',
	MEDIUM: 'ac-heading--medium',
	DARK: 'ac-heading--dark',
	PITCH: 'ac-heading--pitch',
	ALPHA: 'ac-heading--alpha',
	OMEGA: 'ac-heading--omega',
	UPPERCASE: 'ac-heading--uppercase',
};

// Component
const AcHeading = ({
	rank = 2,
	tag = null,
	theme = 'default',
	variant,
	className,
	type,
	children,
}) => {
	const getTag = useMemo(() => {
		return AcIsSet(tag)
			? tag
			: rank && rank === 7
			? 'p'
			: rank > 6
			? 'h6'
			: `h${rank}`;
	}, [rank, tag, type]);

	const getStyleClassNames = useMemo(() => {
		return clsx(
			_CLASSES.MAIN,
			rank && _CLASSES[`H${rank}`],
			theme && _CLASSES[theme.toUpperCase()],
			variant && _CLASSES[variant.toUpperCase()],
			className
		);
	}, [rank, theme, variant, className]);

	const Tag = getTag;

	return AcIsString(children) ? (
		<Tag
			className={getStyleClassNames}
			dangerouslySetInnerHTML={{ __html: children }}
		/>
	) : AcIsObject(children) || AcIsArray(children) ? (
		<Tag className={getStyleClassNames}>{children}</Tag>
	) : null;
};

export default memo(AcHeading);
