import * as Yup from 'yup';

export default function validation() {
	const schema = Yup.object().shape({
		name: Yup.string().max(100, 'Máximo 100 caracteres'),		
	});

	return schema;
}
