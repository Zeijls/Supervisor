// Imports => Utilities
import { AcIsSet, AcIsArray } from './ac-get-type-of';

export const AcSortBy = ({ collection, field, direction = 'asc' }) => {
	if (!AcIsSet(collection) || !AcIsArray(collection)) return collection;
	if (!AcIsSet(field)) return collection;

	const result = collection.slice().sort((a, b) => {
		const aField = a[field];
		const bField = b[field];

		if (!AcIsSet(aField) || !AcIsSet(bField)) return 0;

		if (direction === 'asc') {
			return a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0;
		} else {
			return a[field] > b[field] ? -1 : a[field] < b[field] ? 1 : 0;
		}
	});

	return result;
};

export default AcSortBy;
