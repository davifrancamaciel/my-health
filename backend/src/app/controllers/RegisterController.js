import User from '../models/User';

class RegisterController {
  async store(req, res) {
    const userExist = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExist) {
      return res
        .status(400)
        .json({ error: 'Já existe um usuário com este email' });
    }

    const newUser = {
      ...req.body,
      provider: false,
    };

    const { id, name, email, whatsapp } = await User.create(newUser);

    return res.json({ id, name, email, whatsapp });
  }
}

export default new RegisterController();
