// Imports => React
import React, { useState, useEffect, useMemo, memo } from 'react';
import clsx from 'clsx';

// Imports => Constants
import { ICONS } from '@constants';

// Imports => Atoms
import AcIcon from '@atoms/ac-icon/ac-icon.web';

const _CLASSES = {
	MAIN: 'ac-toaster',
	PROGRESS: 'ac-toaster__progress',
	TYPES: {
		DEFAULT: 'ac-toaster--default',
		INFO: 'ac-toaster--info',
		SUCCESS: 'ac-toaster--success',
		WARNING: 'ac-toaster--warning',
		ERROR: 'ac-toaster--error',
	},
	BODY: 'ac-toaster__body',
	ICON: {
		MAIN: 'ac-icon ac-toaster__icon',
		WRP: 'ac-toaster__icon-wrp',
		DEFAULT: 'ac-icon--message-text-outline',
		INFO: 'ac-icon--information-outline',
		SUCCESS: 'ac-icon--checkbox-marked-circle-outline',
		WARNING: 'ac-icon--alert-outline',
		ERROR: 'ac-icon--alert-circle-outline',
	},
	CONTENT: {
		MAIN: 'ac-toaster__content',
		TITLE: 'ac-toaster__title',
		DESCRIPTION: 'ac-toaster__description',
		CODE: 'ac-toaster__code',
	},
	CLOSE: {
		ICON: 'ac-icon ac-icon--close ac-toaster__close-icon',
		WRP: 'ac-toaster__close-icon-wrp',
	},
};

let mounted = false;

const AcToaster = ({
	callback,
	closeable = true,
	code,
	delay,
	description,
	expires,
	id,
	title,
	variant,
}) => {
	const [timer, setTimer] = useState(null);

	useEffect(() => {
		mounted = true;
		startCountdown();

		return () => {
			mounted = false;
			if (timer) clearTimeout(timer);
			handleClose();
		};
	}, []);

	const startCountdown = () => {
		if (timer) clearTimeout(timer);

		let d = setTimeout(() => {
			const now = new Date().getTime();

			if (now >= expires) {
				handleClose();
			} else {
				startCountdown();
			}
		}, 1000);

		if (mounted) setTimer(d);
	};

	const handleClose = () => {
		if (!closeable) return;
		if (timer) clearTimeout(timer);
		if (callback) callback(id);
	};

	const getCloseIconClassNames = useMemo(() => {
		return clsx(_CLASSES.CLOSE.ICON);
	}, []);

	const getCloseWrpClassNames = useMemo(() => {
		return clsx(_CLASSES.CLOSE.WRP);
	}, []);

	const getCodeClassNames = useMemo(() => {
		return clsx(_CLASSES.CONTENT.CODE);
	}, []);

	const getDescriptionClassNames = useMemo(() => {
		return clsx(_CLASSES.CONTENT.DESCRIPTION);
	}, []);

	const getTitleClassNames = useMemo(() => {
		return clsx(_CLASSES.CONTENT.TITLE);
	}, []);

	const getContentWrpClassNames = useMemo(() => {
		return clsx(_CLASSES.CONTENT.MAIN);
	}, []);

	const getBodyClassNames = useMemo(() => {
		return clsx(_CLASSES.BODY);
	}, []);

	const getStyleClassNames = useMemo(() => {
		return clsx(
			_CLASSES.MAIN,
			variant && _CLASSES.TYPES[variant.toUpperCase()]
		);
	}, [variant]);

	return (
		<div className={getStyleClassNames} id={id} onClick={handleClose}>
			<div className={getBodyClassNames}>
				<div className={getContentWrpClassNames}>
					{title && (
						<div
							className={getTitleClassNames}
							dangerouslySetInnerHTML={{
								__html: title,
							}}
						/>
					)}
					{description && (
						<div
							className={getDescriptionClassNames}
							dangerouslySetInnerHTML={{
								__html: description,
							}}
						/>
					)}

					{code && (
						<div className={getCodeClassNames}>[Error code: {code}]</div>
					)}
				</div>

				{closeable && (
					<div className={getCloseWrpClassNames} onClick={handleClose}>
						<AcIcon icon={ICONS.CLOSE} className={getCloseIconClassNames} />
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(AcToaster);
