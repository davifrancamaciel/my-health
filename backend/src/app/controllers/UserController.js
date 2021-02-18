import Company from '../models/Company';
import User from '../models/User';
import UserIndexService from '../services/user/index';

import removeFile from '../utils/removeFile';

class UserController {
  async index(req, res) {
    const { userProvider } = req;

    if (!userProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão para listar os usuários' });
    }

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
    const { userProvider } = req;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    // if (!userProvider) {
    //   return res
    //     .status(401)
    //     .json({ error: 'Usuário não permissão ver este usuario' });
    // }

    return res.json(user);
  }

  async store(req, res) {
    const { userProvider } = req;

    if (!userProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão para criar' });
    }

    const userExist = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExist) {
      return res.status(400).json({
        error: `Já existe um ${
          req.body.provider ? 'usuário' : 'cliente'
        } com este email`,
      });
    }




    const newUser = {
      ...req.body,
    };

    const {
      id,
      name,
      email,
      provider,
      whatsapp,
      city,
      state,
    } = await User.create(newUser);

    return res.json({
      id,
      name,
      email,
      provider,
      whatsapp,
      city,
      state,
    });
  }

  async update(req, res) {
    const { userProvider } = req;
    const { id, email } = req.body;
    const user = await User.findByPk(id);

    if (user.email !== email) {
      const userExist = await User.findOne({ where: { email } });
      if (userExist) {
        return res.status(400).json({
          error: `Já existe um ${
            req.body.provider ? 'usuário' : 'cliente'
          } com este email`,
        });
      }
    }

    const userUpdate = req.body;
    if (!userProvider) {
      userUpdate.provider = false;

    }

    await user.update(userUpdate);

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
    const { userProvider } = req;

    if (!userProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão para deletar' });
    }

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

    if (user) {
      removeFile(user.image);
    }

    await User.destroy({ where: { id } });

    return res.json({ message: `${user.name} deletado` });
  }

  async list(req, res) {
    const { userProvider, userCompanyId } = req;
    if (!userProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão para listar' });
    }
    const { active } = req.query;

    let whereStatement = {
      provider: false,
    };

    if (active !== '' && active !== undefined) whereStatement.active = active;

    const users = await User.findAll({
      where: whereStatement,
      order: [['name', 'asc']],
      attributes: ['id', 'name', 'whatsapp'],
    });

    function formatLabel(item) {
      return item.whatsapp != null
        ? `${item.name} ${item.whatsapp}`
        : `${item.name}`;
    }

    const usersFormated = users.map(v => ({
      id: v.id,
      title: formatLabel(v),
      value: v.id,
      label: formatLabel(v),
    }));

    return res.json(usersFormated);
  }
}

export default new UserController();
