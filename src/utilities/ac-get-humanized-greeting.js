import moment from 'moment';

// Import => Config
import config from '@config';

export const AcGetHumanizedGreeting = (m) => {
	moment.locale(config.locale);

	m = m || moment();
	let g = null; //return g

	if (!m || !m.isValid()) {
		return;
	} //if we can't find a valid or filled moment, we return.

	const split_afternoon = 12; //24hr time to split the afternoon
	const split_evening = 17; //24hr time to split the evening
	const current_hour = parseFloat(m.format('HH'));

	if (current_hour >= split_afternoon && current_hour <= split_evening) {
		g = 'Goodafternoon';
	} else if (current_hour >= split_evening) {
		g = 'Goodevening';
	} else {
		g = 'Goodmorning';
	}

	return g;
};

export default AcGetHumanizedGreeting;
