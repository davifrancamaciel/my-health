import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form } from '@rocketseat/unform';

import Container from 'components/_layouts/Container';
import SubmitButton from 'components/SubmitButton';
import FormContainer from 'components/_layouts/FormContainer';
import Input from 'components/Inputs/Input';
import InputMoney from 'components/Inputs/InputMoney';
import Select from 'components/Inputs/Select';
import InputMask from 'components/Inputs/InputMask';
import Map from 'components/Map';
import Config from './Config';

import showToast from 'Utils/showToast';
import getLocale from 'Utils/getLocale';
import { getCoordinates } from 'Utils/getCoordinates';
import api from 'services/api';
import history from 'services/browserhistory';
import getValidationErrors from 'Utils/getValidationErrors';
import { priceToNumber } from 'Utils/formatPrice';
import { schedule, daysWeek } from 'Utils/schedule';

import validation from './validation';

const SpecialityCreateEdit = function () {
	const profile = useSelector((state) => state.user.profile);

	const { id } = useParams();
	const [speciality, setSpeciality] = useState({});
	const [loading, setLoading] = useState(false);
	const [types, setTypes] = useState([]);
	const [zipCodeChanged, setZipCodeChanged] = useState('');
	const [selectedLocation, setSelectedLocation] = useState([0, 0]);

	const [scheduleConfig, setScheduleConfig] = useState(schedule);
	const [daysWeekConfig, setDaysWeekConfig] = useState(daysWeek);
	const [active, setActive] = useState(true);

	useEffect(() => {
		if (!profile.provider) {
			history.goBack();
			showToast.error('Para acessar esta as especialidades você precisa ser um Médico');
		}

		async function loadSpecialitiesTypes() {
			try {
				const response = await api.get('specialities-types');
				setTypes(response.data);
			} catch (error) {
				getValidationErrors(error);
			}
		}
		loadSpecialitiesTypes();
	}, []);

	useEffect(() => {
		if (id) {
			async function loadSpeciality(id) {
				try {
					setLoading(true);
					const response = await api.get(`specialities/${id}`);

					setSpeciality(response.data);

					setActive(response.data.active);
					const { scheduleFormated } = response.data;
					if (scheduleFormated) {
						setDaysWeekConfig(scheduleFormated.daysWeekConfig);
						setScheduleConfig(scheduleFormated.scheduleConfig);
					}

					setLoading(false);
				} catch (error) {
					setLoading(false);
					getValidationErrors(error);
				}
			}
			loadSpeciality(id);
		}
	}, []);

	useEffect(() => {
		const { latitude, longitude } = speciality;
		setSelectedLocation([Number(latitude), Number(longitude)]);
	}, [speciality]);

	async function handleSubmit(data) {
		try {
			const daysAvailable = daysWeekConfig.find((x) => x.available === true);
			const hoursAvailable = scheduleConfig.find((x) => x.available === true);
			const checActive = daysAvailable && hoursAvailable ? active : false;
			
			const saveSpeciality = {
				...data,
				active: checActive,
				value: priceToNumber(data.value),
				id: id ? Number(id) : 0,
				latitude: selectedLocation[0],
				longitude: selectedLocation[1],
				schedule: {
					scheduleConfig,
					daysWeekConfig,
				},
			};

			setLoading(true);

			if (saveSpeciality.id) {
				await api.put('specialities', saveSpeciality);
			} else {
				await api.post('specialities', saveSpeciality);
			}

			showToast.success(`Especialidade salva com sucesso!`);

			setLoading(false);
			history.push(`/speciality`);
		} catch (error) {
			getValidationErrors(error);
			setLoading(false);
		}
	}

	return (
		<Container title={`Cadastro de especialidades`} loading={loading} showBack>
			<FormContainer loading={loading} large>
				<Form schema={validation()} onSubmit={handleSubmit} initialData={speciality}>
					<Config
						scheduleConfig={scheduleConfig}
						setScheduleConfig={setScheduleConfig}
						daysWeekConfig={daysWeekConfig}
						setDaysWeekConfig={setDaysWeekConfig}
						active={active}
						setActive={setActive}
					/>
					<fieldset>
						<legend>
							<h2>Dados</h2>
						</legend>

						<div className="field-group">
							<div className="field">
								<Select label="Tipo" name="speciality_type_id" options={types} />
							</div>

							<div className="field">
								<InputMoney name="value" label="Valor" />
							</div>
						</div>
						<div className="field">
							<Input multiline name="description" label="Descrição" />
						</div>
					</fieldset>

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
					</fieldset>

					<SubmitButton loading={loading ? true : false} text={'Salvar'} />
				</Form>
			</FormContainer>
		</Container>
	);
};

export default SpecialityCreateEdit;
