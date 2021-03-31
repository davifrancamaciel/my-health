import React from 'react';
import PropTypes from 'prop-types';

import BackPage from 'components/BackPage';
import Loading from 'components/Loading';

import { Container, Header } from './styles';

function WrapperContainer({ loading = false, children, title, showBack, full }) {
	const _loading = loading;
	return (
		<Container loading={_loading ? _loading.toString() : undefined} full={full}>
			{!full && (
				<Header>
					{title && <h1>{title}</h1>}
					{showBack && <BackPage />}
				</Header>
			)}
			<Loading loading={_loading} />
			{children}
		</Container>
	);
}

export default WrapperContainer;

WrapperContainer.propTypes = {
	loading: PropTypes.bool,
	title: PropTypes.string,
};

WrapperContainer.defautProps = {
	loading: false,
	text: '',
};
