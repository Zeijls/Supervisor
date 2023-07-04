// Imports => Moment
import moment from 'moment/min/moment-with-locales';

// Imports => Constants
import { KEYS } from '@constants';

// Imports => Utilities
import { AcGetState } from '@utils';

export const getLocale = () => {
	return AcGetState(KEYS.LOCALE) || 'nl-NL';
};

export const setLocale = _locale => {
	const locale = _locale || getLocale();

	moment.locale(locale);
};

export default {
	getLocale,
	setLocale,
};
