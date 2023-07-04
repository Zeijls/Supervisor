import React, { useEffect, useMemo, memo } from 'react';
import clsx from 'clsx';

// Imports => Constants
import { SIZES, THEMES, TYPES, VISUALS } from '@constants';

// Imports => Utilities
import { AcUUID, AcSliderInputInstance } from '@utils';

// Imports => Atoms
import AcRipple from '@atoms/ac-ripple/ac-ripple.web';

const _CLASSES = {
	MAIN: 'ac-slider-input',
	TRACKER: 'ac-slider-input__tracker',
	KNOB: 'ac-slider-input__knob',
	OPTIONS: {
		WRP: 'ac-slider-input__options',
		MAIN: 'ac-slider-input__option',
		DOT: 'ac-slider-input__dot',
	},
};

let SliderInstance = null;

const AcSliderInput = ({ value = 3, options = [], callback = () => {} }) => {
	useEffect(() => {
		if (!SliderInstance)
			SliderInstance = new AcSliderInputInstance(value, handleCallback);
		else if (SliderInstance && SliderInstance.destroy) {
			SliderInstance.destroy().then(() => {
				SliderInstance = new AcSliderInputInstance(value, handleCallback);
			});
		}
	}, [value]);

	const getDotClassNames = useMemo(() => {
		return clsx(_CLASSES.OPTIONS.DOT);
	}, []);

	const getOptionClassNames = useMemo(() => {
		return clsx(_CLASSES.OPTIONS.MAIN);
	}, []);

	const getOptionsWrpClassNames = useMemo(() => {
		return clsx(_CLASSES.OPTIONS.WRP);
	}, []);

	const getKnobClassNames = useMemo(() => {
		return clsx(_CLASSES.KNOB);
	}, []);

	const getTrackerClassNames = useMemo(() => {
		return clsx(_CLASSES.TRACKER);
	}, []);

	const getMainClassNames = useMemo(() => {
		return clsx(_CLASSES.MAIN);
	}, []);

	const handleCallback = input => {
		if (callback) callback(input);
	};

	const renderOptions = useMemo(() => {
		const options = [
			{
				id: AcUUID(),
				value: 1,
				label: 'Niet echt',
				visual: 'U2221',
			},
			{
				id: AcUUID(),
				value: 2,
				label: 'Kon beter',
				visual: null,
			},
			{
				id: AcUUID(),
				value: 3,
				label: 'Het ging prima',
				visual: 'U2223',
			},
			{
				id: AcUUID(),
				value: 4,
				label: 'Best goed!',
				visual: null,
			},
			{
				id: AcUUID(),
				value: 5,
				label: 'Erg enthousiast!',
				visual: 'U2222',
			},
		];

		const len = options.length;
		let n = 0;
		let result = [];

		for (n; n < len; n++) {
			const opt = options[n];
			const { id, value: _value, visual, label } = opt;

			const object = (
				<div
					className={getOptionClassNames}
					title={label}
					key={`ac-slider-input-option-${id}`}
					onClick={() => handleCallback(_value)}
				>
					<AcRipple theme={THEMES.WHITE} size={SIZES.SMALL} simple />
					<input
						type={TYPES.RADIO}
						id={id}
						name={`ac-slider-input-option--${id}`}
						value={_value}
					/>
					{visual && <img src={VISUALS[visual]} alt={visual} />}
					{!visual && <span className={getDotClassNames} />}
				</div>
			);

			result.push(object);
		}

		return result;
	}, [value]);

	return (
		<div className={getMainClassNames}>
			<div className={getOptionsWrpClassNames}>{renderOptions}</div>
			<div className={getTrackerClassNames}>
				<div className={getKnobClassNames} draggable />
				<span />
				<span />
				<span />
				<span />
				<span />
			</div>
		</div>
	);
};

export default memo(AcSliderInput);
