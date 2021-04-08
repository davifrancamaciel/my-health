import React from 'react';
import { Route as ReactDOMRoute, Redirect } from 'react-router-dom';

import AuthLayout from '../pages/_layouts/auth';
import DefaultLayout from '../pages/_layouts/default';
import { store } from '../store';

const RouterWrapper = ({ isPrivate = false, component: Component, ...rest }) => {
	const { signed } = store.getState().auth;
	const { profile } = store.getState().user;	

	if (!signed && isPrivate) {
		localStorage.setItem('@returnUrl', `${window.location.pathname}${window.location.search}`);
		return <Redirect to="/" />;
	}

	if (signed && !isPrivate) {
		return <Redirect to="/dashboard" />;
	}

	if (rest.roules) {
		if (signed && isPrivate && !profile.roules.includes(rest.roules)) {
			return <Redirect to="/dashboard" />;
		}
	}

	const Layout = signed ? DefaultLayout : AuthLayout;

	return (
		<ReactDOMRoute
			{...rest}
			render={(props) => (
				<Layout>
					<Component {...props} {...rest} />
				</Layout>
			)}
		/>
	);
};

export default RouterWrapper;
