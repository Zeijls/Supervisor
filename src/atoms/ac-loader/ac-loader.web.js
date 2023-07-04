// Imports => React
import React, { memo, useMemo } from 'react';
import clsx from 'clsx';

// Imports => Constants
import { VISUALS } from '@constants';

const _CLASSES = {
	MAIN: 'ac-loader',
	WRP: {
		MAIN: 'ac-loader-wrp',
		COVER: 'ac-loader-wrp--cover',
		LOADING: 'ac-loader-wrp--loading',
	},
	VISUAL: 'ac-loader__visual',
};

// Component
const AcLoader = ({
	loading = false,
	Visual = VISUALS.LOADER,
	cover = true,
	wrpClassName,
	className,
}) => {
	const getLoaderVisualClassNames = useMemo(() => {
		return clsx(_CLASSES.VISUAL);
	});

	const getLoaderClassNames = useMemo(() => {
		return clsx(_CLASSES.MAIN, className && className);
	});

	const getLoaderWrpClassNames = useMemo(() => {
		return clsx(
			_CLASSES.WRP.MAIN,
			loading && _CLASSES.WRP.LOADING,
			cover && _CLASSES.WRP.COVER,
			wrpClassName && wrpClassName
		);
	}, [loading, cover, wrpClassName]);

	return (
		<div className={getLoaderWrpClassNames}>
			<div className={getLoaderClassNames}>
				<div className={getLoaderVisualClassNames}>
					<img src={Visual} alt={'loader-bb'} />
				</div>
				<span className={'ac-loader__shadow'} />
			</div>
		</div>
	);
};

export default memo(AcLoader);
