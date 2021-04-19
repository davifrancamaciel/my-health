import jwt from 'jsonwebtoken';

import Company from '../models/Company';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: [
        'id',
        'name',
        'email',
        'whatsapp',
        'provider',
        'active',
        'password_hash',
        'image',
        'type',
        'phone',
        'cpf_cnpj',
        'cnh',
        'rg',
        'crm',
        'profession',
        'birth_date',
        'zip_code',
        'state',
        'city',
        'neighborhood',
        'street',
        'complement',
        'latitude',
        'longitude',
        'validated',
        'roules',
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha invalida' });
    }

    const {
      id,
      name,
      image,
      provider,
      active,
      whatsapp,
      phone,
      cpf_cnpj,
      cnh,
      rg,
      crm,
      profession,
      birth_date,
      zip_code,
      state,
      city,
      neighborhood,
      street,
      complement,
      latitude,
      longitude,
      validated,
      roules,
      type,
    } = user;

    if (!validated) {
      return res.status(401).json({
        error: `Usuario ainda não foi validado no E-mail ${email}`,
        user,
      });
    }

    if (!active) {
      return res.status(401).json({ error: 'Usuario inativo', user });
    }

    return res.json({
      user: {
        id,
        name,
        image,
        email,
        provider,
        whatsapp,
        phone,
        cpf_cnpj,
        cnh,
        rg,
        crm,
        profession,
        birth_date,
        zip_code,
        state,
        city,
        neighborhood,
        street,
        complement,
        latitude,
        longitude,
        roules,
        type,
      },

      token: jwt.sign({ id, provider, roules, type }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
