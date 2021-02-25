import { toast } from 'react-toastify';

function error(message) {
	toast.error(message);
}

function success(message) {
	toast.success(message);
}

function warning(message) {
	toast.warning(message);
}

function info(message) {
	toast.info(message);
}

function dark(message) {
	toast.dark(message);
}

export default { error, success, dark, warning, info };
