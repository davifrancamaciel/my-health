import showToast from './showToast';

export default function getValidationErrors(err) {
	console.error(err.response);

	if (!err || !err.response || !err.response.data || !err.response.data.error) {
		showToast.error('Ocorreu um erro no servidor.');
		return;
	}
	const message = err.response.data.error;

	showToast.error(message);

	if (err.response.status === 403) {
		const btnLogout = document.getElementById('logout');
		btnLogout && btnLogout.click();
	}
}
