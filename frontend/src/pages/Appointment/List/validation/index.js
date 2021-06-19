import * as Yup from 'yup';

export default function validation() {
	const schema = Yup.object().shape({
		type: Yup.string().required('O tipo é obrigatório'),
		segment_id: Yup.string().optional(),
		speciality_type_id: Yup.string().optional(),
		provider_name: Yup.string().optional(),
	});

	return schema;
}
