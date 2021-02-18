import * as Yup from 'yup'

export default function validation () {
  const schema = Yup.object().shape({
    oldPassword: Yup.string().required('A senha atual é obrigatória'),

	password: Yup.string()
		.min(6, 'No minimo 6 carcteres')
		.required('A senha nova é obrigatória')
		.max(250, 'Máximo 250 caracteres'),

	confirmPassword: Yup.string()
		.min(6, 'No minimo 6 carcteres')
		.required('A confirmação de senha é obrigatória')
		.max(250, 'Máximo 250 caracteres')
  })

  return schema
}
