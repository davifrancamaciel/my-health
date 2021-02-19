import * as Yup from 'yup'

export default function validation () {
  const schema = Yup.object().shape({
    email: Yup.string().email('Insira um email válido').required('O e-mail é obrigatório'),
    password: Yup.string().required('A senha é obrigatória'),
  })

  return schema
}
