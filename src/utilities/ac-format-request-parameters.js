// Imports => Utilities
import { AcIsSet, AcIsObject, AcIsEmptyString } from './ac-get-type-of';

export const AcFormatRequestParameters = (
  { query, sort, per_page, page },
  options
) => {
  let params = {};

  if (AcIsSet(query) && !AcIsEmptyString(query)) {
    params.q = query;
  }

  if (AcIsSet(sort) && AcIsSet(sort.field)) {
    params.sort = sort.field;
    params.sort_dir = sort.direction;
  }

  if (AcIsSet(per_page) && per_page !== 0) {
    params.per_page = per_page;
  }

  if (AcIsSet(page) && page !== 0) {
    params.page = page;
  }

  if (AcIsSet(options) && AcIsObject(options)) {
    for (let opt in options) {
      params[opt] = options[opt];
    }
  }

  return params;
};
