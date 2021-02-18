import * as Yup from 'yup'

export default function validation () {
  const schema = Yup.object().shape({
    street: Yup.string().optional().max(250, 'Máximo 250 caracteres'),
    zip_code: Yup.string().optional().max(10, 'Máximo 10 caracteres'),
    city: Yup.string().optional().max(100, 'Máximo 100 caracteres'),
    state: Yup.string().max(2, 'Máximo 2 caracteres').optional(),
    latitude: Yup.number().optional(),
    longitude: Yup.number().optional(),
  })

  return schema
}
