// Imports => React
import React, { memo, useMemo, useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import Blazy from 'blazy';

// Imports => Constants
import { TYPES } from '@constants';

// Imports => Utilities
import { AcUUID } from '@utils';

const _CLASSES = {
	MAIN: 'ac-image',
	WRP: 'ac-image-wrp',
	LOADED: 'ac-image-wrp--loaded',
	BLAZY: 'b-lazy',
	IMAGE: 'ac-image--image',
	BACKGROUND: 'ac-image--background-image',
};

const AcImage = ({
	id = `ac-image-${AcUUID()}`,
	placeholder = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
	source,
	srcset = false,
	type = TYPES.BACKGROUND,
	alt = '',
	size = {
		width: 'auto',
		height: 'auto',
	},
	callback,
	wrpClassName,
	className,
	...rest
}) => {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);

	const $wrp = useRef(null);
	const $element = useRef(null);

	let timer = null;
	let delay = 50;
	let blazy = null;

	useEffect(() => {
		init();
		return () => clearTimeout(timer);
	}, [source]);

	const init = () => {
		if (timer) clearTimeout(timer);
		if (!loaded && !error && source) {
			timer = setTimeout(() => {
				if (blazy === null) {
					blazy = new Blazy(getBlazyConfig);
				} else {
					blazy.revalidate();
				}
				delay = 10;
			}, delay);
		}
	};

	const getBlazyConfig = useMemo(() => {
		return {
			selector: `#${id}`,
			container: '#ac-scroller',
			offset: 250,
			loadInvisible: false,
			success: elem => {
				if ($element !== null && $element.current !== null) {
					setLoaded(true);
					if (callback) callback(true);
				}
			},
			error: elem => {
				if ($element !== null && $element.current !== null) {
					setError(true);
					if (callback) callback(false);
				}
			},
		};
	}, [id, callback, source]);

	const getStyleClassNames = useMemo(() => {
		return clsx([_CLASSES.BLAZY, _CLASSES.MAIN, className]);
	}, []);

	const getBackgroundStyleClassNames = useMemo(() => {
		return clsx([
			_CLASSES.BLAZY,
			_CLASSES.MAIN,
			_CLASSES.BACKGROUND,
			className,
		]);
	}, []);

	const getWrapperClassNames = useMemo(() => {
		return clsx([
			_CLASSES.WRP,
			wrpClassName,
			loaded && _CLASSES.LOADED,
			type === TYPES.IMAGE && _CLASSES.IMAGE,
		]);
	}, [loaded]);

	const renderImage = useMemo(() => {
		return (
			<img
				src={placeholder}
				data-src={source}
				data-srcset={srcset}
				className={getStyleClassNames}
				alt={alt}
				ref={$element}
				width={size.width}
				height={size.height}
				id={id}
				{...rest}
			/>
		);
	}, [source]);

	const renderBackgroundImage = useMemo(() => {
		return (
			<div
				data-src={source}
				className={getBackgroundStyleClassNames}
				ref={$element}
				id={id}
				{...rest}
			/>
		);
	}, [source]);

	const getImage = useMemo(() => {
		if (type === TYPES.BACKGROUND) return renderBackgroundImage;
		else if (type === TYPES.IMAGE) return renderImage;
	}, [type, renderImage, renderBackgroundImage]);

	return (
		<div className={getWrapperClassNames} ref={$wrp}>
			{getImage}
		</div>
	);
};

export default memo(AcImage);
