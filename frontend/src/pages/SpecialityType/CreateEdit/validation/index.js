import * as Yup from 'yup';

export default function validation() {
	const schema = Yup.object().shape({
		name: Yup.string().required('O nome é obrigatório').max(100, 'Máximo 100 caracteres'),
		value: Yup.string().required('O valor é obrigatório'),
		segment_id: Yup.string().required('O segmento é obrigatório'),
	});

	return schema;
}
