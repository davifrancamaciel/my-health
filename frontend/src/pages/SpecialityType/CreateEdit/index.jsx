import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from '@rocketseat/unform';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Container from 'components/_layouts/Container';
import SubmitButton from 'components/SubmitButton';
import FormContainer from 'components/_layouts/FormContainer';
import Input from 'components/Inputs/Input';
import InputMoney from 'components/Inputs/InputMoney';
import Select from 'components/Inputs/Select';
import showToast from 'Utils/showToast';
import { priceToNumber } from 'Utils/formatPrice';

import api from 'services/api';
import history from 'services/browserhistory';
import getValidationErrors from 'Utils/getValidationErrors';
import { getTypesSegment } from 'Utils/typeSegmentsConstants';

import validation from './validation';

const SpecialityCreateEdit = function () {
	const { id } = useParams();
	const [speciality, setSpeciality] = useState({});
	const [loading, setLoading] = useState(false);
	const [active, setActive] = useState(true);
	const [segments, setSegments] = useState([]);

	useEffect(() => {
		async function loadSegments() {
			try {
				let params = {};
				if (!id) {
					params.active = true;
				}
				const response = await api.get('segments-list', {
					params: params,
				});
				const data = response.data.map((item) => {
					const type = getTypesSegment().find((x) => x.value === item.type).label;
					return { ...item, label: `${type} ${item.label} (${item.percentage}%)` };
				});
				setSegments(data);
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
					const response = await api.get(`specialities-types/${id}`);

					setSpeciality(response.data);

					setActive(response.data.active);

					setLoading(false);
				} catch (error) {
					setLoading(false);
					getValidationErrors(error);
				}
			}
			loadSpeciality(id);
		}
	}, [id]);

	async function handleSubmit(data) {
		try {
			const saveSpeciality = {
				...data,
				id: id ? Number(id) : 0,
				value: priceToNumber(data.value),
				active,
			};

			setLoading(true);

			if (saveSpeciality.id) {
				await api.put('specialities-types', saveSpeciality);
			} else {
				await api.post('specialities-types', saveSpeciality);
			}

			showToast.success(`Especialidade salva com sucesso!`);

			setLoading(false);
			history.push(`/speciality-type`);
		} catch (error) {
			getValidationErrors(error);
			setLoading(false);
		}
	}

	return (
		<Container title={`Cadastro de especialidades do sistema`} loading={loading} showBack>
			<FormContainer loading={loading}>
				<Form schema={validation()} onSubmit={handleSubmit} initialData={speciality}>
					<fieldset>
						<legend>
							<h2>Dados</h2>
						</legend>

						<div className="field">
							<Select label="Segmento" name="segment_id" options={segments} />
						</div>
						<div className="field-group">
							<div className="field">
								<Input name="name" label="Nome" />
							</div>
							<div className="field">
								<InputMoney name="value" label="Valor" />
							</div>
						</div>
						<FormControlLabel
							control={
								<Switch
									color="primary"
									checked={active}
									onChange={() => setActive(!active)}
									name={`active`}
								/>
							}
							label={`Disponível`}
						/>
					</fieldset>

					<SubmitButton loading={loading ? true : false} text={'Salvar'} />
				</Form>
			</FormContainer>
		</Container>
	);
};

export default SpecialityCreateEdit;
