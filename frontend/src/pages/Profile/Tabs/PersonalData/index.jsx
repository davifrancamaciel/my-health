import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from '@rocketseat/unform';
import * as Yup from 'yup';

import { updateProfileRequest } from 'store/modules/user/actions';

import SubmitButton from 'components/SubmitButton';
import Input from 'components/Inputs/Input';
import Datepicker from 'components/Inputs/Datepicker';
import InputMask from 'components/Inputs/InputMask';
import Dropzone from 'components/Inputs/Dropzone';

import getImage from 'Utils/getImage';
import showToast from 'Utils/showToast';

import { FormContainer } from '../../styles';

const schema = Yup.object().shape({
	
	oldPassword: Yup.string(),
	password: Yup.string(),
	
	confirmPassword: Yup.string(),

	name: Yup.string()
      .required('O Nome é obrigatório')
      .max(250, 'Máximo 250 caracteres'),
    email: Yup.string()
      .email('Insira um email válido')
      .required('O e-mail é obrigatório')
      .max(100, 'Máximo 100 caracteres'),
    profession: Yup.string()
      .optional()
      .max(100, 'Máximo 100 caracteres'),
    phone: Yup.string().max(20, 'Máximo 20 caracteres'),
    whatsapp: Yup.string()
      .required('O whatsapp é obrigatório')
      .max(20, 'Máximo 20 caracteres'),
    cpf_cnpj: Yup.string().max(20, 'Máximo 20 caracteres'),
    cnh: Yup.string().max(20, 'Máximo 20 caracteres'),
    rg: Yup.string().max(20, 'Máximo 20 caracteres'),
    birth_date: Yup.date(),
    zip_code: Yup.string().max(9, 'O máximo são 9 caracteres'),
    state: Yup.string().max(2, 'O máximo são 2 caracteres'),
    city: Yup.string().max(100, 'Máximo 100 caracteres'),
    neighborhood: Yup.string().max(100, 'Máximo 100 caracteres'),
    street: Yup.string().max(250, 'Máximo 250 caracteres'),
    complement: Yup.string().max(100, 'Máximo 100 caracteres')
});

function PersonalData() {
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.user.profile);
	const profileFormated = {
		...profile,
		image: profile.image ? getImage(profile.image, profile.name) : null,
	};
	const loading = useSelector((state) => state.user.loading);
	const [selectedImage, setSelectedImage] = useState();
	const [birthDate, setBirthDate] = useState();

	function handleSubmit(data) {
		const user = {
			...data,
			company_id: profile.company_id,
			image: selectedImage,
		};

		dispatch(updateProfileRequest(user));
	}
	return (
		<FormContainer loading={loading} large>
			<Form schema={schema} initialData={profileFormated} onSubmit={handleSubmit}>
				<fieldset>
					<Dropzone onFileSelectedUpload={setSelectedImage} image={profileFormated.image} />
				</fieldset>

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
							<Input name="profession" type="text" label="Profissão" />
						</div>
					</div>
					<div className="field-group">
						<div className="field">
							<Input name="crm" type="text" label="CRM" />
						</div>
						<div className="field">
							<InputMask mask="999.999.999-99" name="cpf_cnpj" type="tel" label="CPF" />
						</div>

						<div className="field">
							<InputMask mask="99999999999" name="cnh" type="tel" label="CNH" />
						</div>
						<div className="field">
							<InputMask mask="99.999.999-9" name="rg" type="tel" label="RG" />
						</div>
					</div>
					<div className="field-group">
						<div className="field">
							<InputMask mask="(99) 99999-9999" name="whatsapp" type="tel" label="Whatsapp" />
						</div>
						<div className="field">
							<InputMask mask="(99) 99999-9999" name="phone" type="tel" label="Telefone" />
						</div>
						<div className="field">
							<Datepicker
								name="birth_date"
								label="Data de nascimento"
								selected={birthDate}
								onChange={setBirthDate}
							/>
						</div>
						<div className="field"></div>
					</div>
					<div className="field">
						<SubmitButton loading={loading ? true : false} text={'Atualizar perfil'} />
					</div>
				</fieldset>
			</Form>
		</FormContainer>
	);
}

export default PersonalData;
