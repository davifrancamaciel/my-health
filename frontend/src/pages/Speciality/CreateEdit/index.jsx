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
import Map from 'components/MapPositionSelect';
import Config from './Config';

import showToast from 'Utils/showToast';
import getLocale from 'Utils/getLocale';
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
	const [selectedLocationLoaded, setSelectedLocationLoaded] = useState([0, 0]);
	const [selectedLocationClicked, setSelectedLocationClicked] = useState([0, 0]);

	const [scheduleConfig, setScheduleConfig] = useState(schedule);
	const [daysWeekConfig, setDaysWeekConfig] = useState(daysWeek);
	const [active, setActive] = useState(true);
	const [showMap, setShowMap] = useState(false);
	const [segments, setSegments] = useState([]);

	useEffect(() => {
		if (!profile.provider) {
			history.goBack();
			showToast.error('Para acessar esta as especialidades você precisa ser um Médico');
		}
		async function loadSegments() {
			try {
				let params = {};
				if (!id) {
					params.active = true;
				}
				const response = await api.get('segments-list', {
					params: params,
				});
				setSegments(response.data);
			} catch (error) {
				getValidationErrors(error);
			}
		}
		loadSegments();
	}, []);

	useEffect(() => {
		if (id) {
			async function loadSpeciality(id) {
				try {
					setLoading(true);
					const response = await api.get(`specialities/${id}`);
					const { type } = response.data;

					console.log(response.data);
					const company_value = type.value * (type.segment.percentage / 100);
					setSpeciality({
						...response.data,
						segment_id: type.segment_id,
						percentage: type.segment.percentage,
						value_type: type.value,
						provider_value: type.value - company_value,
						company_value,
					});

					loadSpecialitiesTypes(id, type.segment_id);

					setActive(response.data.active);
					const { scheduleFormated } = response.data;
					if (scheduleFormated) {
						setDaysWeekConfig(scheduleFormated.daysWeekConfig);
						setScheduleConfig(scheduleFormated.scheduleConfig);
					}

					setLoading(false);
					setShowMap(true);
				} catch (error) {
					setLoading(false);
					getValidationErrors(error);
				}
			}
			loadSpeciality(id);
		} else {
			setShowMap(true);
		}
	}, [id]);

	useEffect(() => {
		const { latitude, longitude } = speciality;
		if (latitude && longitude) {
			setSelectedLocationLoaded([Number(latitude), Number(longitude)]);
		}
	}, [speciality.latitude, speciality.longitude]);

	useEffect(() => {
		async function loadZipCode() {
			const response = await getLocale(zipCodeChanged);
			setSpeciality({ ...response, ...speciality });
		}
		loadZipCode();
	}, [zipCodeChanged]);

	async function loadSpecialitiesTypes(id, segment_id) {
		try {
			let params = { segment_id };
			if (!id) {
				params.active = true;
			}

			const response = await api.get('specialities-types-list', {
				params: params,
			});
			setTypes(response.data);
		} catch (error) {
			getValidationErrors(error);
		}
	}

	async function handleSubmit(data) {
		try {
			const daysAvailable = daysWeekConfig.find((x) => x.available === true);
			const hoursAvailable = scheduleConfig.find((x) => x.available === true);
			const checActive = daysAvailable && hoursAvailable ? active : false;
			const [latitude, longitude] = selectedLocationClicked;

			const saveSpeciality = {
				...data,
				active: checActive,
				value: priceToNumber(data.value),
				id: id ? Number(id) : 0,
				latitude,
				longitude,
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

	async function changeSegment(segment) {
		setSpeciality({
			...speciality,
			segment_id: segment.id,
			speciality_type_id: 0,
			percentage: segment.percentage,
			value_type: 0,
			provider_value: 0,
			company_value: 0,
		});

		setLoading(true);
		await loadSpecialitiesTypes(id, segment.id);
		setLoading(false);
	}

	function changeType(type) {
		const company_value = Number(type.value_type) * (Number(speciality.percentage) / 100);
		const newSpeciality = {
			...speciality,
			speciality_type_id: type.id,
			value_type: Number(type.value_type),
			provider_value: Number(type.value_type) - company_value,
			company_value,
		};
		console.log(newSpeciality)
		setSpeciality(newSpeciality);
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
								<Select
									label="Segmento"
									name="segment_id"
									options={segments}
									onChange={changeSegment}
								/>
							</div>
							<div className="field">
								<Select label="Tipo" name="speciality_type_id" options={types} onChange={changeType} />
							</div>
						</div>
						<div className="field-group">
							<div className="field">
								<InputMoney name="value_type" label="Valor" disabled />
							</div>
							<div className="field">
								<InputMoney name="percentage" label="Porcentagem" disabled />
							</div>
							<div className="field">
								<InputMoney name="provider_value" label="Valor a receber" disabled />
							</div>
							<div className="field">
								<InputMoney name="company_value" label="Valor UPIS" disabled />
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
						{showMap && (
							<Map
								selectedLocation={selectedLocationLoaded}
								setSelectedLocation={setSelectedLocationClicked}
							/>
						)}
					</fieldset>

					<SubmitButton loading={loading ? true : false} text={'Salvar'} />
				</Form>
			</FormContainer>
		</Container>
	);
};

export default SpecialityCreateEdit;
