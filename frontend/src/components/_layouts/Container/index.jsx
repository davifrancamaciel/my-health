import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

import BackPage from 'components/BackPage';

import { Container, Header } from './styles';

function WrapperContainer({ loading = false, children, title, showBack }) {
	const _loading = loading;
	return (
		<Container loading={_loading ? _loading.toString() : undefined}>
			<Header>
				{title && <h1>{title}</h1>}
				{showBack && <BackPage />}
			</Header>
			<div className="as-loading">
				<CircularProgress size={90} />
			</div>
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
