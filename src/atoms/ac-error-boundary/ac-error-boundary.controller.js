// Imports => React
import React from 'react';
// import Rollbar from 'rollbar';

// Imports => Constants
// import { ENVIRONMENTS } from '@constants';

// Imports => Config
import config from '@config';

class AcErrorBoundaryController extends React.Component {
	// constructor(props) {
	// 	super(props);

	// this.excluded = [
	// 	ENVIRONMENTS.DEV,
	// 	ENVIRONMENTS.TEST,
	// 	ENVIRONMENTS.DEVELOPMENT,
	// 	ENVIRONMENTS.STAGING,
	// 	ENVIRONMENTS.ACCEPT,
	// 	ENVIRONMENTS.LOCAL,
	// ];

	// let environment = this.getCurrentEnvironment();
	// let _config = config.rollbar({ environment });

	// if (this.excluded.indexOf(environment) === -1) {
	// 	this.rollbar = new Rollbar(_config);
	// }
	// }

	// componentDidCatch(error, info) {
	// this.logInfo(info);
	// this.throwError(error);
	// }

	getCurrentEnvironment = () => {
		const { screen } = this.props;
		let environment = screen.replace(/\\/g, '').replace(/\//g, '');
		environment = environment === '' ? 'dashboard' : environment;

		return environment;
	};

	logInfo = info => {
		const {
			payload: { environment },
		} = config.rollbar;

		if (this.excluded.indexOf(environment) === -1) return;

		// Example log event using the rollbar object.
		this.rollbar.info(info || 'example info message from hq-error-boundary');
	};

	throwError = error => {
		const {
			payload: { environment },
		} = config.rollbar;

		if (this.excluded.indexOf(environment) === -1) return;

		// Example error, which will be reported to rollbar.
		this.rollbar.error(error || 'example error from hq-error-boundary');
	};
}

export default AcErrorBoundaryController;
