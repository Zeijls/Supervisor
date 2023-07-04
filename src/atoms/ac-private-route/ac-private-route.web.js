// Imports => React
import React from 'react';
import { withStore } from '@stores';
import { observer } from 'mobx-react-lite';
import { Route, Redirect } from 'react-router-dom';

// Imports => Constants
import { REDIRECT_ROUTE } from '@constants';

// PrivateRoute
const PrivateRoute = ({
	authorized,
	forbidden,
	component: Component,
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				if (!forbidden || (forbidden && authorized)) {
					return <Component {...props} />;
				} else if (
					!authorized &&
					props.location.pathname !== REDIRECT_ROUTE.path &&
					window.location.pathname !== REDIRECT_ROUTE.path
				) {
					return (
						<Redirect from={props.location.pathname} to={REDIRECT_ROUTE.path} />
					);
				} else {
					return null;
				}
			}}
		/>
	);
};

const AcPrivateRoute = ({
	store,
	forbidden,
	component,
	authorized,
	...rest
}) => {
	return (
		<PrivateRoute
			authorized={authorized || store.auth.is_authorized}
			forbidden={forbidden}
			component={component}
			{...rest}
		/>
	);
};

export default withStore(observer(AcPrivateRoute));
