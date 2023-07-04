// Imports => Data
import { COUNTRIES_LIST } from '@data/countries.data';

// Imports => Utilities
import { AcIsSet, AcIsEmptyString } from '@utils';

export const AcFormatCountry = (country) => {
	if (!AcIsSet(country) || AcIsEmptyString(country)) return '-';
	if (!AcIsSet(COUNTRIES_LIST[country])) return '-';

	return COUNTRIES_LIST[country];
};
