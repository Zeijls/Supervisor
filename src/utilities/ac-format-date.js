// Imports => Moment
import moment from 'moment';

// Imports => Config
import { getLocale, setLocale } from '@config/moment.js';

export const AcFormatDate = (input, from = 'DD-MM-YYYY', to = 'DD MMM Y') => {
	// Set and Get locale settings
	setLocale();
	const locale = getLocale();

	// Verify valid date / moment object
	if (!moment(input, from).isValid()) return input;

	const format = moment(input).creationData().format;
	const _from = from ? from : format;

	// Format input
	const output = moment(input, _from).format(to);

	return output;
};

export const AcGetTimeDifference = (
	time,
	now = moment(),
	format = null,
	ms = false
) => {
	setLocale();

	const start = moment(now).isValid() ? moment(now) : moment();
	const end = format ? moment(time, format) : moment(time);
	const diff = moment.duration(start.diff(end));

	if (ms) return diff.asMilliseconds();
	return diff;
};

export const AcGetDaysRemaining = (date, now = moment()) => {
	setLocale();

	const start = moment(now).isValid() ? moment(now) : moment();
	const end = moment(date);
	const diff = end.diff(start, 'days');

	return diff;
};

export default AcFormatDate;
