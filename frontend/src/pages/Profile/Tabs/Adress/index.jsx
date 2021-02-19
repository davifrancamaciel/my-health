import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from '@rocketseat/unform';

import { updateProfileRequest } from 'store/modules/user/actions';

import SubmitButton from 'components/SubmitButton';
import Input from 'components/Inputs/Input';
import InputMask from 'components/Inputs/InputMask';

import showToast from 'Utils/showToast';
import getLocale from 'Utils/getLocale';
import { getCoordinates } from 'Utils/getCoordinates';
import Map from '../../Map';
import validation from './validation';

import { FormContainer } from '../../styles';

function Adress() {
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.user.profile);
	const loading = useSelector((state) => state.user.loading);

	const [userProvfile, setUserProvfile] = useState({ ...profile });
	const [zipCodeChanged, setZipCodeChanged] = useState('');
	const [selectedLocation, setSelectedLocation] = useState([profile.latitude || 0, profile.longitude || 0]);

	useEffect(() => {
		async function loadZipCode() {
			const response = await getLocale(zipCodeChanged);
			console.log(response);

			if (response) {
				const { location } = await getCoordinates(
					`${response.state} ${response.city} ${response.neighborhood} ${response.street}`
				);
				console.log(location);
				setSelectedLocation([location.lat, location.lng]);
			}

			setUserProvfile({
				...userProvfile,
				...response,
			});
		}
		loadZipCode();
	}, [zipCodeChanged]);

	function handleSubmit(data) {
		const user = {
			...userProvfile,
			...data,
			latitude: selectedLocation[0],
			longitude: selectedLocation[1],
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
		<FormContainer loading={loading} large>
			<Form schema={validation()} initialData={userProvfile} onSubmit={handleSubmit}>
				<fieldset>
					<legend>
						<h2>Endereço</h2>
					</legend>
					<div className="field-group">
						<div className="field">
							<InputMask
								mask="99999-999"
								label="Cep"
								name="zip_code"
								type="tel"
								onChangezip_code={setZipCodeChanged}
							/>
						</div>
						<div className="field">
							<Input name="state" type="text" label="UF" />
						</div>
						<div className="field">
							<Input name="city" type="text" label="Cidade" />
						</div>
						<div className="field">
							<Input name="neighborhood" type="text" label="Bairro" />
						</div>
					</div>
					<div className="field-group">
						<div className="field">
							<Input name="street" type="text" label="Logradouro" />
						</div>
						<div className="field">
							<Input
								name="complement"
								type="text"
								label="Complemento"
								placeholder="Ex.: Nº 0000, fundos etc..."
							/>
						</div>
					</div>
				</fieldset>

				<fieldset>
					<legend>
						<h2>Localização</h2>
						<span>Selecione sua localização no mapa</span>
					</legend>
					<Map selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
					<div className="field">
						<SubmitButton loading={loading ? true : false} text={'Atualizar endereço'} />
					</div>
				</fieldset>
			</Form>
		</FormContainer>
	);
}

export default Adress;
