import React, { useCallback, useMemo, memo } from 'react';
import clsx from 'clsx';

// Imports => Constants
import { SIZES, THEMES } from '@constants';

// Imports => Atoms
import AcIcon from '@atoms/ac-icon/ac-icon.web';
import AcRipple from '@atoms/ac-ripple/ac-ripple.web';

const _CLASSES = {
	MAIN: 'ac-pill',
	WHITE: 'ac-pill--white',
	OMEGA: 'ac-pill--omega',
	LABEL: 'ac-pill__label',
	ICON: 'ac-pill__icon',
};

const AcPill = ({ theme, label, icon, callback }) => {
	const handleClick = useCallback(() => {
		if (callback) callback();
	}, [callback]);

	const getLabelClassNames = useMemo(() => {
		return clsx(_CLASSES.LABEL);
	}, [label]);

	const getIconClassNames = useMemo(() => {
		return clsx(_CLASSES.ICON);
	}, [icon]);

	const getMainClassNames = useMemo(() => {
		return clsx(_CLASSES.MAIN, theme && _CLASSES[theme.toUpperCase()]);
	}, [theme]);

	return (
		<div className={getMainClassNames} onClick={handleClick}>
			{icon && <AcIcon icon={icon} className={getIconClassNames} />}
			{label && (
				<span
					className={getLabelClassNames}
					dangerouslySetInnerHTML={{
						__html: label,
					}}
				/>
			)}
			<AcRipple theme={THEMES.OMEGA} simple size={SIZES.SMALL} />
		</div>
	);
};

export default memo(AcPill);
