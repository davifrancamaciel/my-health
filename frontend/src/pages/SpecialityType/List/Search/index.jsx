import React, { useEffect, useState } from 'react';
import { Form } from '@rocketseat/unform';

import Input from 'components/Inputs/Input';
import SubmitButton from 'components/SubmitButton';
import FormSearchContainer from 'components/_layouts/FormSearchContainer';
import Select from 'components/Inputs/Select';

import api from 'services/api'
import getValidationErrors from 'Utils/getValidationErrors'
import { getTypesSegment } from 'Utils/typeSegmentsConstants';

export default function Search({ onSearch, setPage }) {
	const [options, setOptions] = useState([]);

	useEffect(() => {
		async function loadSegments() {
			try {
				const response = await api.get('segments-list', {
					params: { active: true },
				});
				const data = response.data.map((item) => {
					const type = getTypesSegment().find((x) => x.value === item.type).label;
					return { ...item, label: `${type} ${item.label} (${item.percentage}%)` };
				});
				setOptions(data);
			} catch (error) {
				getValidationErrors(error);
			}
		}
		loadSegments();
	}, []);

	function handleSubmit(data) {
		setPage(1);
		onSearch(data);
	}

	return (
		<FormSearchContainer>
			<Form onSubmit={handleSubmit}>
				<div className="field-group">
					<div className="field">
						<Select label="Segmento" name="segment_id" options={options} />
					</div>
					<div className="field">
						<Input name="name" label="Nome" />
					</div>
					
					<div className="field">
						<SubmitButton text={'Buscar'} />
					</div>
				</div>
			</Form>
		</FormSearchContainer>
	);
}
