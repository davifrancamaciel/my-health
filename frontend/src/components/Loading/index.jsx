import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Container } from './styles';

function Loading({ loading }) {
	return (
		<Container loading={loading}>
			<CircularProgress size={90} />
		</Container>
	);
}

export default Loading;
