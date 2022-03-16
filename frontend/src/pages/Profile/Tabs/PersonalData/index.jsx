import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from '@rocketseat/unform';
import { parseISO } from 'date-fns';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';

import { updateProfileRequest } from 'store/modules/user/actions';

import SubmitButton from 'components/SubmitButton';
import Input from 'components/Inputs/Input';
import Datepicker from 'components/Inputs/Datepicker';
import InputMask from 'components/Inputs/InputMask';
import InputMaskPhone from 'components/Inputs/InputMaskPhone';
import Dropzone from 'components/Inputs/Dropzone';
import { typePersonEnum } from 'enums/typePersonEnum';
import useQuery from 'hooks/queryString';

import getImage from 'Utils/getImage';

import { FormContainer } from '../../styles';
import validation from './validation';
import showToast from 'Utils/showToast';


function PersonalData() {
	const query = useQuery();
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.user.profile);
	const loading = useSelector((state) => state.user.loading);

	const [userProfile, setUserProfile] = useState({});
	const [selectedImage, setSelectedImage] = useState();
	const [birthDate, setBirthDate] = useState();
	const [isProvider, setIsProvider] = useState(false);

	useEffect(() => {
		if (query.get('register')) {
			const message = 'Complete seu cadastro em nossa plataforma';
			showToast.info(message);
		}
	}, []);

	useEffect(() => {
		const profileFormated = {
			...profile,
			image: profile.image ? getImage(profile.image, profile.name) : null,
		};
		if (profile.birth_date) {
			setBirthDate(parseISO(profile.birth_date));
		}
		setUserProfile(profileFormated);
		setIsProvider(profile.provider);
	}, [profile]);

	function handleSubmit(data) {
		const user = {
			...userProfile,
			...data,
			image: selectedImage,
			provider: isProvider,
		};

		dispatch(updateProfileRequest(user));
	}
	return (
		<FormContainer loading={loading} large>
			<Form schema={validation()} initialData={userProfile} onSubmit={handleSubmit}>
				<fieldset>
					<Dropzone onFileSelectedUpload={setSelectedImage} image={userProfile.image} />
				</fieldset>

				<fieldset>
					<legend>
						<h2>Dados</h2>
					</legend>
					<div className="field-group">
						<div className="field">
							<Input name="name" type="text" label="Nome" />
						</div>
						<div className="field">
							<Input name="email" type="email" label="Email" />
						</div>
					</div>

					<div className="field-group">
						<div className="field">
							<Input name="profession" type="text" label="Profissão" />
						</div>
						<div className="field">
							<Input name="bank_agency" type="text" label="Agência" />
						</div>
						<div className="field">
							<Input name="bank_account" type="text" label="Conta" />
						</div>
						<div className="field">
							<Input name="bank_pix" type="text" label="PIX" />
						</div>
					</div>
					<div className="field-group">
						<div className="field">
							<InputMask
								mask={
									profile.type && profile.type === typePersonEnum.LEGAL
										? '99.999.999/9999-99'
										: '999.999.999-99'
								}
								label={profile.type && profile.type === typePersonEnum.LEGAL ? 'CNPJ' : 'CPF'}
								name="cpf_cnpj"
								type="tel"
							/>
						</div>
						<div className="field">
							<InputMask mask="99.999.999-9" name="rg" type="tel" label="RG" />
						</div>

						<div className="field">
							<InputMask mask="99999999999" name="cnh" type="tel" label="CNH" />
						</div>
						<div className="field">
							<Input name="crm" type="text" label="CRM" />
						</div>
					</div>
					<div className="field-group">
						<div className="field">
							<InputMask mask="(99) 99999-9999" name="whatsapp" type="tel" label="Whatsapp" />
						</div>
						<div className="field">
							<InputMaskPhone mask="(99) 99999-9999" name="phone" type="tel" label="Telefone" />
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

					{/* <FormControlLabel
						control={
							<Checkbox
								color="primary"
								checked={isProvider}
								onChange={() => {
									setIsProvider(!isProvider);
								}}
								name="provider"
							/>
						}
						label="Desejo realizar consultas (sou um médico)"
					/> */}

					<div className="field">
						<SubmitButton loading={loading ? true : false} text={'Atualizar perfil'} />
					</div>
				</fieldset>
			</Form>
		</FormContainer>
	);
}

export default PersonalData;
