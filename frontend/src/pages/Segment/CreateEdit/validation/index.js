import * as Yup from 'yup';

export default function validation() {
	const schema = Yup.object().shape({
		name: Yup.string().required('O nome é obrigatório').max(100, 'Máximo 100 caracteres'),		
		percentage: Yup.string().required('A porcentagem é obrigatória'),		
		type: Yup.string().required('O tipo é obrigatório'),
	});

	return schema;
}
