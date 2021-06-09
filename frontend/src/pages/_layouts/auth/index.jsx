import React from 'react';

import Splash from 'components/Splash';
import { Wrapper } from './styles';

const AuthLayout = ({ children, isBgNone }) => {
	return (
		<Splash>
			<Wrapper isBgNone={isBgNone}>{children}</Wrapper>
		</Splash>
	);
};

export default AuthLayout;
