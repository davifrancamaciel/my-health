import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input, Select } from '@rocketseat/unform';

import { signUpRequest } from 'store/modules/auth/actions';
import SubmitButton from 'components/SubmitButton';
import InputMask from 'components/Inputs/InputMask';
import validation from './validation';
import getLocale from 'Utils/getLocale';
import { typePersonEnumList, typePersonEnum } from 'enums/typePersonEnum';

import Term from './Term';

import logo from 'assets/logo.png';
import { Content, BackgroundSignUp, AnimationContainerRight } from '../_layouts/auth/styles';

const SignUp = () => {
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.auth.loading);
	const [provider, setProvider] = useState(false);
	const [open, setOpen] = useState(false);
	const [zipCodeChanged, setZipCodeChanged] = useState('');
	const [adress, setAdress] = useState({});
	const [currentLocation, setCurrentLocation] = useState([0, 0]);

	useEffect(() => {
		setProvider(window.location.pathname.includes('provider'));
		navigator.geolocation.getCurrentPosition((postition) => {
			const { latitude, longitude } = postition.coords;
			setCurrentLocation([latitude, longitude]);
		});
	}, []);

	useEffect(() => {
		async function loadZipCode() {
			const response = await getLocale(zipCodeChanged);
			setAdress({ ...response });
		}
		loadZipCode();
	}, [zipCodeChanged]);

	function handleSubmit(data) {
		const user = {
			...data,
			...adress,
			provider,
		};
		const [latitude, longitude] = currentLocation;
		if (!!latitude && !!longitude) {
			user.latitude = latitude;
			user.longitude = longitude;
		}

		dispatch(signUpRequest(user));
	}

	return (
		<>
			<Term open={open} setOpen={setOpen} provider={provider} />
			<BackgroundSignUp />
			<Content>
				<AnimationContainerRight>
					<img src={logo} alt="UPIS Saúde" />
					<Form schema={validation()} onSubmit={handleSubmit} initialData={{ type: typePersonEnum.PHYSICAL }}>
						<Input name="name" type="text" placeholder="Seu nome completo" />
						<Input name="email" type="email" placeholder="Seu email para acesso" />
						<div className="field-group">
							<div className="field">
								<InputMask
									mask="(99) 99999-9999"
									name="whatsapp"
									type="tel"
									placeholder="Seu whatsapp"
								/>
							</div>
							<div className="field">
								<InputMask
									mask="99999-999"
									placeholder="Seu CEP"
									name="zip_code"
									type="tel"
									onChangezip_code={setZipCodeChanged}
								/>
							</div>
						</div>
						<Select
							style={{ display: provider ? 'initial' : 'none' }}
							placeholder="Desejo entrar como"
							name="type"
							options={typePersonEnumList}
						/>

						<Input name="password" type="password" placeholder="Sua senha" />
						{/* <a onClick={() => setOpen(!open)}>Termo de adesão</a> */}
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
