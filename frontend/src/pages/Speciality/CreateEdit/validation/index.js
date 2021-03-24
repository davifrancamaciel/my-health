import * as Yup from 'yup';

export default function validation() {
	const schema = Yup.object().shape({
		description: Yup.string().max(1000, 'Máximo 1000 caracteres'),
		value: Yup.string().required('O valor é obrigatório'),
		speciality_type_id: Yup.string().required('O tipo é obrigatório'),
		street: Yup.string().optional().max(250, 'Máximo 250 caracteres'),
		zip_code: Yup.string().optional().max(10, 'Máximo 10 caracteres'),
		neighborhood: Yup.string().optional().max(100, 'Máximo 100 caracteres'),
		city: Yup.string().optional().max(100, 'Máximo 100 caracteres'),
		state: Yup.string().max(2, 'Máximo 2 caracteres').optional(),
		latitude: Yup.number().optional(),
		longitude: Yup.number().optional(),
		complement: Yup.string().max(100, 'Máximo 100 caracteres')
	});

	return schema;
}
