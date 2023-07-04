// Imports => Constants
import { KEYS } from '@constants';

// Imports => Utilities
import { AcCapitalize } from '@utils';

export const AcFormatErrorMessage = (error, list = false) => {
	let msg = false;
	let code =
		error && error.response && error.response.status
			? error.response.status
			: false;

	if (!code || code === 500) {
		return `An unknown error occured. Please try it again or get in contact with ${KEYS.SUPPORT_EMAIL_ADDRESS}`;
	}

	if (error.response && error.response.data && error.response.data.errors) {
		msg = [];

		for (let key in error.response.data.errors) {
			if (error.response.data.errors.hasOwnProperty(key)) {
				if (error.response.data.errors[key][0] !== 'p')
					if (!list) {
						msg.push(AcCapitalize(error.response.data.errors[key][0]));
					} else if (list) {
						msg.push({
							line: AcCapitalize(error.response.data.errors[key][0]),
							key,
						});
					}
			}
		}

		if (!list) msg = msg.join('<br/>');
	} else if (
		error.response &&
		error.response.data &&
		error.response.data.message
	) {
		msg = error.response.data.message;
	}

	return msg;
};

export const AcFormatErrorCode = (error) => {
	return error && error.response && error.response.status
		? error.response.status
		: 'Network Error';
};

export default {
	AcFormatErrorMessage,
	AcFormatErrorCode,
};
