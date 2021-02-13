import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';

import { Button } from './styles';

function SubmitButton({ loading = false, text, ...rest }) {
	const _loading = loading;

	return (
		<Button {...rest} loading={_loading ? _loading.toString() : undefined} type="submit" disabled={_loading}>
			{_loading ? <CircularProgress size={26} /> : text}
		</Button>
	);
}

export default SubmitButton;

SubmitButton.propTypes = {
	loading: PropTypes.bool,
	text: PropTypes.string,
};

SubmitButton.defautProps = {
	loading: false,
	text: '',
};
