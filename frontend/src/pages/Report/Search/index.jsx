import React, { useEffect, useState } from 'react';
import { Form } from '@rocketseat/unform';
import { isBefore, startOfMonth, endOfMonth } from 'date-fns';

import Input from 'components/Inputs/Input';
import Datepicker from 'components/Inputs/Datepicker';
import SubmitButton from 'components/SubmitButton';
import FormSearchContainer from 'components/_layouts/FormSearchContainer';
import Select from 'components/Inputs/Select';

import api from 'services/api';
import getValidationErrors from 'Utils/getValidationErrors';
import showToast from 'Utils/showToast';
import { getTypesSegment } from 'Utils/typeSegmentsConstants';

export default function Search({ onSearch }) {
	const [startDate, setStartDate] = useState(startOfMonth(new Date()));
	const [endDate, setEndDate] = useState(endOfMonth(new Date()));
	const [typesSegment] = useState(getTypesSegment());
	const [segments, setSegments] = useState([]);
	const [allSegments, setAllSegments] = useState([]);
	const [typesSpecialities, setTypesSpecialities] = useState([]);
	const [allTypesSpecialities, setAllTypesSpecialities] = useState([]);

	useEffect(() => {
		loadSegmentsAndSpecialitiesTypes();
	}, []);

	async function loadSegmentsAndSpecialitiesTypes() {
		try {
			const [respSegments, respTypes] = await Promise.all([
				api.get('segments-list', { params: { active: true } }),
				api.get('specialities-types-list', { params: { active: true } }),
			]);
			setAllSegments(respSegments.data);
			setAllTypesSpecialities(respTypes.data);
		} catch (error) {
			getValidationErrors(error);
		}
	}

	function filterSegments(type_segment) {
		const typesFilter = allSegments.filter((x) => x.type === type_segment);
		setSegments(typesFilter);
		setTypesSpecialities([]);
	}

	function filterSpecialityTypes(segment_id) {
		const typesFilter = allTypesSpecialities.filter((x) => x.segment_id === segment_id);
		setTypesSpecialities(typesFilter);
	}

	function handleSubmit(data) {
		if (isBefore(endDate, startDate)) {
			showToast.error('A data inicial não pode ser maior que a final.');
			return;
		}

		onSearch(data);
	}

	return (
		<FormSearchContainer>
			<Form onSubmit={handleSubmit}>
				<div className="field-group">
					<div className="field">
						<Select
							label="Tipo"
							name="type"
							options={typesSegment}
							onSelected={(e) => filterSegments(e.value)}
						/>
					</div>
					<div className="field">
						<Select
							label="Segmento"
							name="segment_id"
							options={segments}
							onSelected={(e) => filterSpecialityTypes(e.value)}
						/>
					</div>
					<div className="field">
						<Select label="Especialidade" name="speciality_type_id" options={typesSpecialities} />
					</div>
					<div className="field">
						<Input name="provider_name" label="Médico" />
					</div>

					<div className="field">
						<Input name="user_name" label="Paciente" />
					</div>

				</div>
				<div className="field-group">
					<div className="field">
						<Datepicker name="start_date" label="Data de" selected={startDate} onChange={setStartDate} />
					</div>
					<div className="field">
						<Datepicker name="end_date" label="Data ate" selected={endDate} onChange={setEndDate} />
					</div>

					<div className="field">
						<SubmitButton text={'Buscar'} />
					</div>
				</div>
			</Form>
		</FormSearchContainer>
	);
}
