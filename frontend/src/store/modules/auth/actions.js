import {
	AUTH_SIGN_IN_REQUEST,
	AUTH_SIGN_IN_SUCCESS,
	AUTH_SIGN_UP_REQUEST,
	AUTH_SIGN_UP_SUCCESS,
	AUTH_SIGN_FAILURE,
	AUTH_SIGN_OUT,
	AUTH_CHANGE_PASSWORD_REQUEST,
} from 'constants/auth';

export function signInRequest(email, password) {
	return {
		type: AUTH_SIGN_IN_REQUEST,
		payload: { email, password },
	};
}

export function signInSuccess(token, user) {
	return {
		type: AUTH_SIGN_IN_SUCCESS,
		payload: { token, user },
	};
}

export function changePasswordRequest() {
	return {
		type: AUTH_CHANGE_PASSWORD_REQUEST,
	};
}

export function signFailure() {
	return {
		type: AUTH_SIGN_FAILURE,
	};
}

export function signOut() {
	return {
		type: AUTH_SIGN_OUT,
	};
}

export function signUpRequest(data) {
	return {
		type: AUTH_SIGN_UP_REQUEST,
		payload: data,
	};
}

export function signUpSuccess() {
	return {
		type: AUTH_SIGN_UP_SUCCESS,
	};
}
