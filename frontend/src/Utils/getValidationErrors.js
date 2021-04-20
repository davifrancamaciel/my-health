import showToast from './showToast';
import history from 'services/browserhistory';

export default function getValidationErrors(err) {
	console.error(err);

	if (!err || !err.response || !err.response.data || !err.response.data.error) {
		showToast.error('Ocorreu um erro no servidor.');
		return;
	}
	const message = err.response.data.error;

	showToast.error(message);

	if (message.includes('Token')) {
		// history.push(`/logout`);
	}
}
