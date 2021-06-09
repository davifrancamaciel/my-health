import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from '@rocketseat/unform';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Container from 'components/_layouts/Container';
import SubmitButton from 'components/SubmitButton';
import FormContainer from 'components/_layouts/FormContainer';
import Input from 'components/Inputs/Input';
import showToast from 'Utils/showToast';

import api from 'services/api';
import history from 'services/browserhistory';
import getValidationErrors from 'Utils/getValidationErrors';

import validation from './validation';

const SegmentCreateEdit = function () {
	const { id } = useParams();
	const [segment, setSegment] = useState({});
	const [loading, setLoading] = useState(false);
	const [active, setActive] = useState(true);

	useEffect(() => {
		if (id) {
			async function loadSpeciality(id) {
				try {
					setLoading(true);
					const response = await api.get(`segments/${id}`);

					setSegment(response.data);

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
			const saveSegment = {
				...data,
				id: id ? Number(id) : 0,
				active,
			};

			setLoading(true);

			if (saveSegment.id) {
				await api.put('segments', saveSegment);
			} else {
				await api.post('segments', saveSegment);
			}

			showToast.success(`Segmento salvo com sucesso!`);

			setLoading(false);
			history.push(`/segment`);
		} catch (error) {
			getValidationErrors(error);
			setLoading(false);
		}
	}

	return (
		<Container title={`Cadastro de segmentos do sistema`} loading={loading} showBack>
			<FormContainer loading={loading}>
				<Form schema={validation()} onSubmit={handleSubmit} initialData={segment}>
					<fieldset>
						<legend>
							<h2>Dados</h2>
						</legend>
						<div className="field-group">
							<div className="field">
								<Input name="name" label="Nome" />
							</div>
							<div className="field">
								<Input name="percentage" label="Porcentagem" />
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

export default SegmentCreateEdit;
