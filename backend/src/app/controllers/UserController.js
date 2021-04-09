import User from '../models/User';
import UserIndexService from '../services/user/index';

import removeFile from '../utils/removeFile';

class UserController {
  async index(req, res) {
    const { name, email, provider, page = 1, orderBy, sorting } = req.query;

    const { count, rows } = await UserIndexService.run({
      name,
      email,
      provider,
      page,
      orderBy,
      sorting,
    });

    res.header('X-Total-Count', count);

    return res.json({ count, rows });
  }

  async find(req, res) {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'name',
        'email',
        'whatsapp',
        'phone',
        'provider',
        'active',
        'createdAt',
      ],
    });

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  }

  async update(req, res) {
    const { id, email } = req.body;
    const user = await User.findByPk(id);

    if (user.email !== email) {
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(400).json({
          error: `Já existe alguém com este email`,
        });
      }
    }

    await user.update({ ...req.body });

    const { name, provider, whatsapp } = await User.findByPk(id);

    return res.json({
      id,
      name,
      email,
      provider,
      whatsapp,
    });
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (Number(id) === Number(req.userId)) {
        return res
          .status(401)
          .json({ error: 'Você não pode remover o seu próprio registro' });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(400).json({ error: 'Registo não encontrado' });
      }

      await User.destroy({ where: { id } });

      if (user) {
        removeFile(user.image);
      }

      return res.json({ message: `${user.name} deletado` });
    } catch (error) {
      if (error && error.original.column.includes('speciality_id')) {
        return res.status(401).json({
          error:
            'Não é possivel excluir um registro que já possui especialidades médicas vinculadas',
        });
      }

      return res.status(500).json({
        error: 'Ocoreu um erro interno',
        messages: error,
        serverError: error,
      });
    }
  }
}

export default new UserController();
