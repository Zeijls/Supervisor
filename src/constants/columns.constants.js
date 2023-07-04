export const CONTRACTS = [
  {
    key: 'id',
    label: 'ID',
    visible: true,
    sortable: true,
  },
  {
    key: 'name',
    label: 'Contract',
    visible: true,
    sortable: true,
  },
  {
    key: 'clientName',
    label: 'Klant',
    visible: true,
    sortable: true,
  },
  {
    key: 'costs',
    label: 'Kosten',
    visible: true,
    sortable: true,
  },
  {
    key: 'frequency',
    label: 'Frequentie',
    visible: true,
    sortable: true,
  },
  {
    key: 'starts_at',
    label: 'Opgesteld',
    visible: true,
    sortable: true,
  },
];

export const CLIENTS = [
  {
    key: 'id',
    label: 'ID',
    visible: true,
    sortable: true,
  },
  {
    key: 'name',
    label: 'Klantnaam',
    visible: true,
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    visible: true,
    sortable: true,
  },
  {
    key: 'city',
    label: 'Stad',
    visible: true,
    sortable: true,
  },
  {
    key: 'postal_code',
    label: 'Postcode',
    visible: true,
    sortable: true,
  },
  {
    key: 'chamber_of_commerce',
    label: 'Kamer van Koophandel',
    visible: true,
    sortable: true,
  },
];

export const CONTACTS = [
  {
    key: 'name',
    label: 'Contact',
    visible: true,
    sortable: true,
  },
  {
    key: 'email',
    label: 'Email',
    visible: true,
    sortable: true,
  },
  {
    key: 'phone',
    label: 'Telefoonnummer',
    visible: true,
    sortable: true,
  },
  {
    key: 'function',
    label: 'Functie',
    visible: true,
    sortable: true,
  },
  {
    key: 'company',
    label: 'Bedrijf',
    visible: true,
    sortable: true,
  },
  {
    key: 'button',
    label: 'Wijzigen',
    visible: true,
    sortable: true,
  },
];

export const REPORT = [
  {
    key: 'id',
    label: 'ID',
    visible: true,
    sortable: true,
  },
  {
    key: 'contract.name',
    label: 'Contractnaam',
    visible: true,
    sortable: true,
  },
  {
    key: 'from_date',
    label: 'Opgesteld',
    visible: true,
    sortable: true,
  },
  {
    key: 'to_date',
    label: 'Loopt af',
    visible: true,
    sortable: true,
  },
  {
    key: 'creator.name',
    label: 'Gemaakt door',
    visible: true,
    sortable: true,
  },
  {
    key: 'updated_at',
    label: 'Gewijzigd op',
    visible: true,
    sortable: true,
  },
];
export default {
  CONTRACTS,
  CLIENTS,
  CONTACTS,
  REPORT,
};
