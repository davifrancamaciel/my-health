import React, { useState } from 'react';
import { Form } from '@rocketseat/unform';

import Input from 'components/Inputs/Input';
import SubmitButton from 'components/SubmitButton';
import Select from 'components/Inputs/Select';
import FormSearchContainer from 'components/_layouts/FormSearchContainer';
import { getTypesSegment } from 'Utils/typeSegmentsConstants';

export default function Search({ onSearch, setPage }) {
	const [types] = useState(getTypesSegment());

	function handleSubmit(data) {
		setPage(1);
		onSearch(data);
	}

	return (
		<FormSearchContainer>
			<Form onSubmit={handleSubmit}>
				<div className="field-group">
					<div className="field">
						<div className="field">
							<Select label="Tipo" name="type" options={types} />
						</div>
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
