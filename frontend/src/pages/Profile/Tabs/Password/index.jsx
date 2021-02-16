import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from '@rocketseat/unform';
import * as Yup from 'yup';

import { updateProfileRequest } from 'store/modules/user/actions';

import SubmitButton from 'components/SubmitButton';
import Input from 'components/Inputs/Input';

import getImage from 'Utils/getImage';
import showToast from 'Utils/showToast';

import { FormContainer } from '../../styles';

const schema = Yup.object().shape({
	oldPassword: Yup.string(),
	password: Yup.string(),
	confirmPassword: Yup.string(),
});
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
			...data,
			company_id: profile.company_id,			
		};
		if (data.oldPassword && (!data.password || !data.confirmPassword)) {
			showToast.error('Para alterar a sua senha preencha também os campos de nova senha e confirmação');
			return;
		}
		if (data.password && data.password !== data.confirmPassword) {
			showToast.error('As senhas informadas estão diferentes');
			return;
		}

		dispatch(updateProfileRequest(user));
	}
	return (
		<FormContainer loading={loading}>
			<Form schema={schema} initialData={profileFormated} onSubmit={handleSubmit}>
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
