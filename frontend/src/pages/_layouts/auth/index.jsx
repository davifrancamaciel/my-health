import React from 'react';

import Splash from 'components/Splash';
import { Wrapper } from './styles';

const AuthLayout = ({ children }) => {
	return (
		<Splash>
			<Wrapper>{children}</Wrapper>
		</Splash>
	);
};

export default AuthLayout;
