import { uuid } from 'uuidv4';

import User from '../models/User';
import Mail from '../../lib/Mail';

class ForgotController {
  async store(req, res) {
    const { email } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'name', 'email', 'active'],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!user.active) {
      return res.status(401).json({ error: 'Usuario inativo', user });
    }
    const token_reset = uuid();

    await user.update({ token_reset });

    Mail.sendMail({
      to: `${user.name} <${email}>`,
      subject: 'Redefinição de senha',
      template: 'forgot',
      context: {
        name: user.name,
        email,
        url: `${process.env.APP_URL_WEB}/reset?token=${token_reset}`,
      },
    });

    return res.json({
      message: `${user.name} verique sua caixa de email. Enviamos um link de redefinição de senha.`,
    });
  }

  async update(req, res) {
    try {
      const { token, password } = req.body;

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

      await user.update({ token_reset: null, validated: true, password });

      return res.json({
        message: `${user.name} sua senha foi alterda com sucesso.`,
        email: user.email,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Ocoreu um erro interno',
        messages: error.inner,
        serveError: error,
      });
    }
  }
}

export default new ForgotController();
