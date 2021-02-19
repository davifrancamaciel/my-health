import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';

import { signInRequest, changePasswordRequest, signFailure } from 'store/modules/auth/actions';
import SubmitButton from 'components/SubmitButton';
import { Content, BackgroundSignIn } from '../_layouts/auth/styles';

import logo from 'assets/logo.png';
import validation from './validation';
import getValidationErrors from 'Utils/getValidationErrors';
import showToast from 'Utils/showToast';
import api from 'services/api';
import useQuery from 'hooks/queryString';

const Reset = () => {
	const query = useQuery();
	const loading = useSelector((state) => state.auth.loading);
	const dispatch = useDispatch();

	async function handleSubmit(data) {
		try {
			if (data.password && data.password !== data.confirmPassword) {
				showToast.error('As senhas informadas estão diferentes');
				return;
			}

			const userUpdate = {
				...data,
				token: query.get('token'),
			};
			
			dispatch(changePasswordRequest());

			const response = await api.put('forgot', userUpdate);
			const { email, message } = response.data;
			
			showToast.success(message);
			dispatch(signInRequest(email, data.password));
		} catch (error) {
			getValidationErrors(error);
			dispatch(signFailure());
		}
	}
	return (
		<>
			<Content>
				<img src={logo} alt="UPIS Saúde" />
				<Form schema={validation()} onSubmit={handleSubmit}>
					<Input type="password" name="password" placeholder="Nova senha" />
					<Input type="password" name="confirmPassword" placeholder="Confirme a nova senha" />
					<SubmitButton loading={loading} text={'Redefinir'} />
					<Link to="/">Já tenho conta</Link>
					<Link to="/register">Criar conta</Link>
				</Form>
			</Content>
			<BackgroundSignIn />
		</>
	);
};

export default Reset;
