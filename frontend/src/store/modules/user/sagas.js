import { all, takeLatest, put, call } from 'redux-saga/effects';

import { USER_UPDATE_PROFILE_REQUEST } from 'constants/user';
import api from 'services/api';
import { updateProfileFailure, updateProfileSuccess } from './actions';
import { signInSuccess } from '../auth/actions';
import getValidationErrors from 'Utils/getValidationErrors';
import showToast from 'Utils/showToast';

export function* updateProfile({ payload }) {
	try {
		const { name, email, image, whatsapp, ...rest } = payload.data;
		const profile = Object.assign({ name, email, image, whatsapp, ...rest }, rest.oldPassword ? rest : {});

		let formData = new FormData();

		formData.append('name', profile.name);
		formData.append('email', profile.email);
		formData.append('whatsapp', profile.whatsapp);
		formData.append('phone', profile.phone);
		formData.append('cpf_cnpj', profile.cpf_cnpj);
		formData.append('cnh', profile.cnh);
		formData.append('rg', profile.rg);
		formData.append('crm', profile.crm);
		formData.append('profession', profile.profession);
		formData.append('birth_date', profile.birth_date);

		formData.append('zip_code', profile.zip_code);
		formData.append('state', profile.state ? profile.state : '');
		formData.append('city', profile.city);
		formData.append('neighborhood', profile.neighborhood);
		formData.append('street', profile.street);
		formData.append('complement', profile.complement);
		formData.append('latitude', profile.latitude);
		formData.append('longitude', profile.longitude);
		formData.append('provider', profile.provider);

		if (profile.oldPassword) {
			formData.append('oldPassword', profile.oldPassword);
			formData.append('password', profile.password);
			formData.append('confirmPassword', profile.confirmPassword);
		}
		if (image) {
			formData.append('file', image);
		}

		const response = yield call(api.put, 'profile', formData);
		showToast.success('Perfil alterado com sucesso.');

		yield put(updateProfileSuccess(response.data));

		const { token } = response.data;
		api.defaults.headers['Authorization'] = `Bearer ${token}`;
		yield put(signInSuccess(token, response.data));
	} catch (error) {
		getValidationErrors(error);
		yield put(updateProfileFailure());
	}
}
export default all([takeLatest(USER_UPDATE_PROFILE_REQUEST, updateProfile)]);
