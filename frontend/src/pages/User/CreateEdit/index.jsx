import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from '@rocketseat/unform';
import { useSelector } from 'react-redux';

import Container from 'components/_layouts/Container';
import SubmitButton from 'components/SubmitButton';
import FormContainer from 'components/_layouts/FormContainer';
import Input from 'components/Inputs/Input';
import InputMask from 'components/Inputs/InputMask';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import showToast from 'Utils/showToast';
import api from 'services/api';
import history from 'services/browserhistory';
import getValidationErrors from 'Utils/getValidationErrors';
import validation from './validation';

const UserCreateEdit = () => {
	const { id } = useParams();
	const [user, setUser] = useState({});
	const [loading, setLoading] = useState(false);
	const [active, setActive] = useState(true);
	const [reset, setReset] = useState(false);
	const [provider, setProvider] = useState(true);
	const profile = useSelector((state) => state.user.profile);

	useEffect(() => {
		if (id) {
			async function loadUser(id) {
				try {
					setLoading(true);
					const response = await api.get(`users/${id}`);
					console.log(response.data);
					setUser(response.data);
					setActive(response.data.active);
					setProvider(response.data.provider);
					setLoading(false);
				} catch (error) {
					setLoading(false);
					getValidationErrors(error);
				}
			}
			loadUser(id);
		} else {
			setUser({
				...user,
				active: true,
			});
		}
	}, []);

	async function handleSubmit(data) {
		console.log(data);
		try {
			const saveUser = {
				...data,
				active,
				reset,
				provider,
				id: id ? Number(id) : 0,
			};

			if (!saveUser.id) {
				saveUser.password = process.env.REACT_APP_PASSWORD_DEFAULT;
				saveUser.validated = true;
			}

			if (saveUser.reset) saveUser.password = process.env.REACT_APP_PASSWORD_DEFAULT;

			setLoading(true);

			if (saveUser.id) {
				await api.put('users', saveUser);
			} else {
				await api.post('users', saveUser);
			}

			showToast.success(`Usuário salvo com sucesso!`);

			setLoading(false);
			history.push(`/user`);
		} catch (error) {
			getValidationErrors(error);
			setLoading(false);
		}
	}

	return (
		<Container title={`Cadastro de usuários do sistema`} showBack>
			<FormContainer loading={loading}>
				<Form onSubmit={handleSubmit} initialData={user} schema={validation(profile.company_provider)}>
					<fieldset>
						<legend>
							<h2>Dados</h2>
						</legend>
						<div className="field">
							<Input name="name" type="text" label="Nome" />
						</div>

						<div className="field-group">
							<div className="field">
								<Input name="email" type="email" label="Email" />
							</div>
							<div className="field">
								<InputMask mask="(99) 99999-9999" name="whatsapp" type="tel" label="Whatsapp" />
							</div>
						</div>
					</fieldset>
					<fieldset>
						<FormControlLabel
							control={
								<Switch
									color="primary"
									checked={active}
									onChange={() => setActive(!active)}
									name={`active`}
								/>
							}
							label={`Ativo`}
						/>
					</fieldset>
					<fieldset>
						<FormControlLabel
							control={
								<Switch
									color="primary"
									checked={provider}
									onChange={() => setProvider(!provider)}
									name={`provider`}
								/>
							}
							label={`Realizará consultas (Médico)`}
						/>
					</fieldset>

					<fieldset>
						<FormControlLabel
							control={
								<Switch
									color="primary"
									checked={reset}
									onChange={() => setReset(!reset)}
									name={`reset`}
								/>
							}
							label={`Restaurar senha para ${process.env.REACT_APP_PASSWORD_DEFAULT}`}
						/>
					</fieldset>

					<SubmitButton loading={loading ? true : false} text={'Salvar'} />
				</Form>
			</FormContainer>
		</Container>
	);
};

export default UserCreateEdit;
