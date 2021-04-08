import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';

import { signUpRequest } from '../../store/modules/auth/actions';
import SubmitButton from '../../components/SubmitButton';
import InputMask from '../../components/Inputs/InputMask';
import validation from './validation';

import logo from '../../assets/logo.png';
import { Content, BackgroundSignUp, AnimationContainerRight } from '../_layouts/auth/styles';

const SignUp = () => {
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.auth.loading);
	const [provider, setProvider] = useState(false);

	useEffect(() => {
		setProvider(window.location.pathname.includes('provider'));
	}, []);

	function handleSubmit({ name, email, password, whatsapp }) {
		dispatch(signUpRequest(name, email, password, whatsapp, provider));
	}

	return (
		<>
			<BackgroundSignUp />
			<Content>
				<AnimationContainerRight>
					<img src={logo} alt="UPIS Saúde" />
					<Form schema={validation()} onSubmit={handleSubmit}>
						<Input name="name" type="text" placeholder="Seu nome completo" />
						<InputMask mask="(99) 99999-9999" name="whatsapp" type="tel" placeholder="Seu whatsapp" />
						<Input name="email" type="email" placeholder="Seu email para acesso" />
						<Input name="password" type="password" placeholder="Sua senha" />
						<SubmitButton loading={loading} text={'Criar conta'} />
						<Link to="/">Já tenho conta</Link>
						<Link to="/forgot">Esqueci minha senha</Link>
					</Form>
				</AnimationContainerRight>
			</Content>
		</>
	);
};

export default SignUp;
