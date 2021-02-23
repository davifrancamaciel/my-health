import React from 'react';

import { all, takeLatest, call, put } from 'redux-saga/effects';

import history from '../../../services/browserhistory';
import { AUTH_SIGN_IN_REQUEST, AUTH_SIGN_UP_REQUEST, AUTH_SIGN_OUT } from '../../../constants/auth';
import { signInSuccess, signFailure, signUpSuccess } from './actions';
import api from '../../../services/api';
import showToast from '../../../Utils/showToast';
import getValidationErrors from '../../../Utils/getValidationErrors';

export function* signIn({ payload }) {
	try {
		const { email, password } = payload;

		// if (email === 'davifrancamaciel@gmail.com') {
		// 	const { token, user } = dataUser;
		// 	api.defaults.headers['Authorization'] = `Bearer ${token}`;

		// 	yield put(signInSuccess(token, user));
		// 	history.push('/dashboard');
		// 	return;
		// }

		const response = yield call(api.post, '/sessions', {
			email,
			password,
		});

		const { token, user } = response.data;

		api.defaults.headers['Authorization'] = `Bearer ${token}`;

		yield put(signInSuccess(token, user));

		history.push('/dashboard');
	} catch (error) {
		getValidationErrors(error);
		yield put(signFailure());
	}
}

export function* signUp({ payload }) {
	try {
		const { name, email, password, whatsapp, company_name } = payload;

		const response = yield call(api.post, 'register', {
			name,
			email,
			password,
			whatsapp,
		});
		console.log(response.data);
		// history.push('/');
		const { message } = response.data;
		showToast.success(message);
		yield put(signUpSuccess());
	} catch (error) {
		getValidationErrors(error);
		yield put(signFailure());
	}
}
function setToken({ payload }) {
	if (!payload) return;

	const { token } = payload.auth;

	if (token) {
		api.defaults.headers['Authorization'] = `Bearer ${token}`;
	}
}

function signOut() {
	history.push('/');
}
export default all([
	takeLatest('persist/REHYDRATE', setToken),
	takeLatest(AUTH_SIGN_IN_REQUEST, signIn),
	takeLatest(AUTH_SIGN_UP_REQUEST, signUp),
	takeLatest(AUTH_SIGN_OUT, signOut),
]);

const dataUser = {
	user: {
		id: 1,
		name: 'Davi França Maciel',
		image: null,
		email: 'davifrancamaciel@gmail.com',
		provider: true,
		whatsapp: '(66) 66666-6666',
		phone: '',
		cpf_cnpj: '',
		cnh: '',
		rg: '',
		crm: '',
		profession: '',
		birth_date: null,
		zip_code: null,
		state: '',
		city: null,
		neighborhood: null,
		street: null,
		complement: null,
		latitude: null,
		longitude: null,
	},
	token:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicHJvdmlkZXIiOnRydWUsImlhdCI6MTYxMzgyMzQ1OSwiZXhwIjoxNjE0NDI4MjU5fQ.GnNKbHtUbZySv1Q0ec4fsHys6ORQ1Ez2ld33REgXxhc',
};
