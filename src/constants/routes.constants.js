// Imports => Constants
import { ICONS } from './icons.constants';
import { TITLES } from './titles.constants';

// Imports => Utilities
import { AcUUID } from '@utils';

// Imports => Views
import {
  AcForgotPassword,
  AcHome,
  AcLogin,
  AcResetPassword,
  // Contract
  AcContractOverview,
  AcContractDetail,
  AcContractNew,

  // Client
  AcClientOverview,
  AcClientDetail,

  // Report
  AcReportOverview,
  AcReportDetail,
} from '@views';
import acReportDetail from '../views/ac-report-detail/ac-report-detail';

export const PATHS = {
  HOME: '/',
  LOGIN: '/inloggen',
  FORGOT_PASSWORD: '/wachtwoord-vergeten',
  RESET_PASSWORD: '/wachtwoord-resetten',

  // Contract
  CONTRACTOVERVIEW: '/contract-overview',
  CONTRACTDETAIL: '/contract-detail/:id?',
  NEWCONTRACT: '/contract-new/:id?',

  // Client
  CLIENTOVERVIEW: '/client-overview',
  CLIENTDETAIL: '/client-detail/:id?',

  // Report
  REPORTOVERVIEW: '/report-overview',
  REPORTDETAIL: '/report-detail/:id?',
};

export const ROUTES = {
  HOME: {
    id: AcUUID(),
    name: 'Home',
    label: TITLES.DASHBOARD,
    path: PATHS.HOME,
    component: AcHome,
    icon: ICONS.GRID,
    roles: null,
    forbidden: true,
    exact: true,
  },
  FORGOT_PASSWORD: {
    id: AcUUID(),
    name: 'Forgot Password',
    label: null,
    path: PATHS.FORGOT_PASSWORD,
    component: AcForgotPassword,
    roles: null,
    forbidden: false,
    exact: true,
  },
  RESET_PASSWORD: {
    id: AcUUID(),
    name: 'Reset Password',
    label: null,
    path: PATHS.RESET_PASSWORD,
    component: AcResetPassword,
    roles: null,
    forbidden: false,
    exact: true,
  },
  LOGIN: {
    id: AcUUID(),
    name: 'Login',
    label: null,
    path: PATHS.LOGIN,
    component: AcLogin,
    roles: null,
    forbidden: false,
    exact: true,
  },
  // Contract
  CONTRACTOVERVIEW: {
    id: AcUUID(),
    name: 'contract-overview',
    label: TITLES.CONTRACTS,
    path: PATHS.CONTRACTOVERVIEW,
    component: AcContractOverview,
    icon: ICONS.LAYERS,
    roles: null,
    forbidden: false,
    exact: true,
  },
  CONTRACTDETAIL: {
    id: AcUUID(),
    name: 'contract-detail',
    label: null,
    path: PATHS.CONTRACTDETAIL,
    component: AcContractDetail,
    roles: null,
    forbidden: false,
    exact: true,
  },
  NEWCONTRACT: {
    id: AcUUID(),
    name: 'contract-new',
    label: null,
    path: PATHS.NEWCONTRACT,
    component: AcContractNew,
    roles: null,
    forbidden: false,
    exact: true,
  },
  // Client
  CLIENTOVERVIEW: {
    id: AcUUID(),
    name: 'client-overview',
    label: TITLES.CLIENTS,
    path: PATHS.CLIENTOVERVIEW,
    component: AcClientOverview,
    icon: ICONS.PEOPLE,
    roles: null,
    forbidden: false,
    exact: true,
  },
  CLIENTDETAIL: {
    id: AcUUID(),
    name: 'client-detail',
    label: null,
    path: PATHS.CLIENTDETAIL,
    component: AcClientDetail,
    roles: null,
    forbidden: false,
    exact: true,
  },
  // Report
  REPORTOVERVIEW: {
    id: AcUUID(),
    name: 'report-overview',
    label: TITLES.REPORTS,
    path: PATHS.REPORTOVERVIEW,
    component: AcReportOverview,
    icon: ICONS.NOTEPAD,
    roles: null,
    forbidden: false,
    exact: true,
  },
  REPORTDETAIL: {
    id: AcUUID(),
    name: 'report-detail',
    label: TITLES.REPORTS,
    path: PATHS.REPORTDETAIL,
    component: AcReportDetail,
    icon: ICONS.LAYERS,
    roles: null,
    forbidden: false,
    exact: true,
  },
};

export const AUTHENTICATION_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];

export const NAVIGATION_ITEMS = [
  ROUTES.HOME,
  ROUTES.CONTRACTOVERVIEW,
  ROUTES.CLIENTOVERVIEW,
  ROUTES.REPORTOVERVIEW,
];

export const DEFAULT_ROUTE = ROUTES.HOME;
export const REDIRECT_ROUTE = ROUTES.LOGIN;
