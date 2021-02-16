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
    } = user;

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
      },

      token: jwt.sign({ id, provider }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
