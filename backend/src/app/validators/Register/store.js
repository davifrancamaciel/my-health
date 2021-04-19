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
      whatsapp: Yup.string()
        .required()
        .max(20, 'Máximo 20 caracteres'),
      type: Yup.string()
        .nullable()
        .max(1, 'Máximo 1 caractere'),
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
      latitude: Yup.number().nullable(),
      longitude: Yup.number().nullable(),
      password: Yup.string()
        .min(6)
        .required(),
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
