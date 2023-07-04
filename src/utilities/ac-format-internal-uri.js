// Imports => Constants
import { KEYS, ROUTES } from '@constants';

// Imports => Utilities
import { AcIsSet } from './ac-get-type-of';

const GetRoute = ({ id, entity, equipment_group, name }) => {
	let result = null;

	const type = entity.replace('-', '_').replace(/ /g, '_').toLowerCase();
	const group = AcIsSet(equipment_group) && equipment_group.replace(/-/g, '_');

	switch (type) {
		case KEYS.COMPANIES:
		case KEYS.COMPANY:
			result = ROUTES.COMPANY_DETAIL.path;
			break;

		case KEYS.CONFIGURATIONS:
		case KEYS.CONFIGURATION:
			result = ROUTES.CONFIGURATION_DETAIL.path;
			break;

		case KEYS.CONTRACTS:
		case KEYS.CONTRACT:
			result = ROUTES.CONTRACT_DETAIL.path;
			break;

		case KEYS.CONTROL_UNITS:
		case KEYS.CONTROL_UNIT:
			result = ROUTES.CONTROL_UNIT_DETAIL.path;
			break;

		case KEYS.HAMMERS:
		case KEYS.HAMMER:
			result = ROUTES.HAMMER_DETAIL.path;
			break;

		case KEYS.POWERPACKS:
		case KEYS.POWERPACK:
		case KEYS.POWER_PACKS:
		case KEYS.POWER_PACK:
			result = ROUTES.POWERPACK_DETAIL.path;
			break;

		case KEYS.PROJECTS:
		case KEYS.PROJECT:
			result = ROUTES.PROJECT_DETAIL.path;
			break;

		case KEYS.USERS:
		case KEYS.USER:
			result = ROUTES.USER_DETAIL.path;
			break;

		case KEYS.EQUIPMENT_TYPES:
		case KEYS.EQUIPMENT_TYPE:
			switch (group) {
				case KEYS.CONTROL_UNITS:
					result = ROUTES.CONTROL_UNIT_TYPE_DETAIL.path;
					break;

				case KEYS.HAMMERS:
					result = ROUTES.HAMMER_TYPE_DETAIL.path;
					break;

				case KEYS.POWERPACKS:
					result = ROUTES.POWERPACK_TYPE_DETAIL.path;
					break;

				default:
			}
			break;

		default:
	}

	return result;
};

export const AcFormatInternalURI = (link, value) => {
	if (!link || !value) return null;

	let route = GetRoute(link);

	if (route) {
		route = route.replace(':id', link.id);
	}

	return route;
};
