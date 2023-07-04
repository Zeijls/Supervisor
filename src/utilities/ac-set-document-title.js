// Imports => Constants
import { TITLES } from '@constants';

export const AcSetDocumentTitle = title => {
	if (title) {
		document.title = `${title} - ${TITLES.BASE}`;
	} else {
		document.title = TITLES.BASE;
	}
};

export const AcGetDocumentTitle = title => {
	let result = '';

	if (title) {
		result = `${title} - ${TITLES.BASE}`;
	} else {
		result = TITLES.BASE;
	}

	return result;
};

export default AcSetDocumentTitle;
