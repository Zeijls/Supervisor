import { ROLES } from '@constants';

export const KEYBOARD_SHORTCUTS = [
	{
		title: 'Global',
		restricted: false,
		items: [
			{
				label: 'Close modal',
				key: 'Escape',
			},
			{
				label: 'Expand/collapse navigation',
				key: '[',
			},
			{
				label: 'Collapse navigation',
				key: ']',
			},
		],
	},
	{
		title: 'Data tables',
		restricted: false,
		items: [
			{
				label: 'Previous page',
				key: 'Arrow left',
			},
			{
				label: 'Next page',
				key: 'Arrow right',
			},
		],
	},
	{
		title: 'Overview pages',
		restricted: false,
		items: [
			{
				label: 'Search',
				key: '/',
			},
			{
				label: 'Add new',
				key: 'c',
			},
		],
	},
	{
		title: 'Detail pages',
		restricted: false,
		items: [
			{
				label: 'Edit',
				key: 'e',
			},
		],
	},
];
