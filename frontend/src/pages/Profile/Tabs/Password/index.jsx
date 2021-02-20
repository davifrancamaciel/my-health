import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from '@rocketseat/unform';

import { updateProfileRequest } from 'store/modules/user/actions';

import SubmitButton from 'components/SubmitButton';
import Input from 'components/Inputs/Input';

import getImage from 'Utils/getImage';
import showToast from 'Utils/showToast';
import validation from './validation'

import { FormContainer } from '../../styles';


function Password() {
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.user.profile);
	const profileFormated = {
		...profile,
		image: profile.image ? getImage(profile.image, profile.name) : null,
	};
	const loading = useSelector((state) => state.user.loading);

	function handleSubmit(data) {
		const user = {
			...profileFormated,
			...data,
		};
		
		if (data.password && data.password !== data.confirmPassword) {
			showToast.error('As senhas informadas estão diferentes');
			return;
		}

		dispatch(updateProfileRequest(user));
	}
	return (
		<FormContainer loading={loading}>
			<Form schema={validation()} initialData={profileFormated} onSubmit={handleSubmit}>
				<fieldset>
					<legend>
						<h2>Credenciais</h2>
					</legend>

					<div className="field">
						<Input type="password" name="oldPassword" label="Sua senha atual" />
					</div>
					<div className="field">
						<Input type="password" name="password" label="Nova senha" />
					</div>
					<div className="field">
						<Input type="password" name="confirmPassword" label="Confirme a nova senha" />
					</div>

					<div className="field">
						<SubmitButton loading={loading ? true : false} text={'Atualizar senha'} />
					</div>
				</fieldset>
			</Form>
		</FormContainer>
	);
}

export default Password;
