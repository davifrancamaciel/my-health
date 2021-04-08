import { uuid } from 'uuidv4';

import User from '../models/User';
import Mail from '../../lib/Mail';

class RegisterController {
  async store(req, res) {
    try {
      const userExist = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExist) {
        return res
          .status(400)
          .json({ error: 'Já existe um usuário com este email' });
      }

      const token_reset = uuid();

      const newUser = {
        ...req.body,
        token_reset,
      };

      const { name, email } = await User.create(newUser);

      Mail.sendMail({
        to: `${name} <${email}>`,
        subject: 'Seja bem vindo ao UPIS Saúde',
        template: 'validate',
        context: {
          name,
          email,
          url: `${process.env.APP_URL_WEB}?token=${token_reset}`,
        },
      });

      return res.json({
        message: `${name} verique sua caixa de email. Enviamos um link para verificar que você é você.`,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Ocoreu um erro interno',
        messages: error.inner,
        serveError: error,
      });
    }
  }

  async update(req, res) {
    try {
      const { token } = req.body;
      const user = await User.findOne({
        where: { token_reset: token },
        attributes: ['id', 'name', 'email', 'active'],
      });

      if (!user) {
        return res
          .status(401)
          .json({ error: 'Usuário não encontrado. Token inválido' });
      }

      if (!user.active) {
        return res.status(401).json({ error: 'Usuario inativo', user });
      }

      await user.update({ token_reset: null, validated: true });

      return res.json({
        message: `${user.name} sua conta foi validada com sucesso.`,
        email: user.email,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Ocoreu um erro interno ao validar sua conta.',
        messages: error.inner,
        serveError: error,
      });
    }
  }
}

export default new RegisterController();
