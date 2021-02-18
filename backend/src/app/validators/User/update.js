import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .max(250, 'Máximo 250 caracteres'),
      email: Yup.string()
        .email()
        .required()
        .max(100, 'Máximo 100 caracteres'),
      profession: Yup.string()
        .nullable()
        .max(100, 'Máximo 100 caracteres'),
      whatsapp: Yup.string()
        .required()
        .max(20, 'Máximo 20 caracteres'),
      phone: Yup.string()
        .nullable()
        .max(20, 'Máximo 20 caracteres'),
      cpf_cnpj: Yup.string()
        .nullable()
        .max(20, 'Máximo 20 caracteres'),
      cnh: Yup.string()
        .nullable()
        .max(20, 'Máximo 20 caracteres'),
      rg: Yup.string()
        .nullable()
        .max(20, 'Máximo 20 caracteres'),
      crm: Yup.string()
        .nullable()
        .max(20, 'Máximo 20 caracteres'),
      birth_date: Yup.string().nullable(),
      street: Yup.string()
        .nullable()
        .max(250, 'Máximo 250 caracteres'),
      zip_code: Yup.string()
        .nullable()
        .max(10, 'Máximo 10 caracteres'),
      city: Yup.string()
        .nullable()
        .max(100, 'Máximo 100 caracteres'),
      state: Yup.string()
        .max(2, 'Máximo 2 caracteres')
        .nullable(),
      // latitude: Yup.string().nullable(),
      // longitude: Yup.string().nullable(),
      provider: Yup.boolean().nullable(),
      active: Yup.boolean().nullable(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) => {
        password ? field.required().oneOf([Yup.ref('password')]) : field;
      }),
    });

    await schema.validate(req.body, {
      abortEarly: false,
    });
    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'A validação falhou', messages: err.inner });
  }
};
