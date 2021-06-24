import * as Yup from 'yup';

export default function validation() {
	const schema = Yup.object().shape({
		name: Yup.string().required('O Nome é obrigatório').max(250, 'Máximo 250 caracteres'),
		email: Yup.string()
			.email('Insira um email válido')
			.required('O e-mail é obrigatório')
			.max(100, 'Máximo 100 caracteres'),
		profession: Yup.string().optional().max(100, 'Máximo 100 caracteres'),
		phone: Yup.string().max(20, 'Máximo 20 caracteres'),
		whatsapp: Yup.string().required('O whatsapp é obrigatório').max(20, 'Máximo 20 caracteres'),
		cpf_cnpj: Yup.string().max(20, 'Máximo 20 caracteres'),
		cnh: Yup.string().max(20, 'Máximo 20 caracteres'),
		crm: Yup.string().max(20, 'Máximo 20 caracteres'),
		rg: Yup.string().max(20, 'Máximo 20 caracteres'),
		birth_date: Yup.date().nullable(),
		bank_agency: Yup.string().max(10, 'Máximo 10 caracteres'),
		bank_account: Yup.string().max(10, 'Máximo 10 caracteres'),
		bank_pix: Yup.string().max(50, 'Máximo 50 caracteres'),
	});

	return schema;
}
