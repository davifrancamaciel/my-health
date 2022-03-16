import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';

import SubmitButton from 'components/SubmitButton';
import { Content, BackgroundForgot, AnimationContainerLeft } from '../_layouts/auth/styles';

import logo from 'assets/logo.png';
import validation from './validation';
import getValidationErrors from 'Utils/getValidationErrors';
import showToast from 'Utils/showToast';
import api from 'services/api';

const Forgot = () => {
	const [loading, setLoading] = useState(false);

	async function handleSubmit(data) {
		try {
			setLoading(true);

			const response = await api.post('forgot', data);
			showToast.success(response.data.message);

			setLoading(false);
		} catch (error) {
			getValidationErrors(error);
			setLoading(false);
		}
	}
	return (
		<>
			<Content>
				<AnimationContainerLeft>
					<img src={logo} alt="UPIS Saúde" />
					<Form schema={validation()} onSubmit={handleSubmit}>
						<Input name="email" type="email" placeholder="Seu e-mail" />
						<SubmitButton loading={loading} text={'Esqueci a senha'} />
						<Link to="/login">Já tenho conta</Link>
						<Link to="/">Inicio</Link>
					</Form>
				</AnimationContainerLeft>
			</Content>
			<BackgroundForgot />
		</>
	);
};

export default Forgot;
