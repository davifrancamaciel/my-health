import React, { useEffect, useState } from 'react';

import useQuery from 'hooks/queryString';

import Header from 'components/Header';
import { Wrapper } from './styles';

const DefaultLayout = ({ children }) => {
	const query = useQuery();
	const [loadind, setLoadind] = useState(false);

	useEffect(() => {
		const reload = query.get('r');
		if (reload) {
			setLoadind(true);
			window.location.href = `${window.location.origin}${window.location.pathname}`;
		} else {
			setLoadind(false);
		}
	}, []);
	if (loadind) return <div />;
	else
		return (
			<Wrapper className="as-layout-default">
				<Header />
				{children}
			</Wrapper>
		);
};

export default DefaultLayout;
