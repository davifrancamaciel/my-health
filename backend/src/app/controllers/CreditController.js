import Credit from '../models/Credit';
import User from '../models/User';

import CreditIndexService from '../services/credit/index';
import CreateCreditService from '../services/credit/create';
import UpdateCreditService from '../services/credit/update';

class CreditController {
  async index(req, res) {
    const { userProvider } = req;

    if (!userProvider) {
      return res.status(401).json({
        error: 'Usuário não tem permissão para listar os Créditos',
      });
    }

    const {
      description,
      start_date,
      end_date,
      page = 1,
      orderBy,
      sorting,
      limit,
      user_name,
    } = req.query;

    const { count, rows } = await CreditIndexService.run({
      description,
      start_date,
      end_date,
      page,
      orderBy,
      sorting,
      limit,
      user_name,
    });

    res.header('X-Total-Count', count);

    return res.json({ count, rows });
  }

  async find(req, res) {
    const { id } = req.params;

    const credit = await Credit.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!credit) {
      return res.status(400).json({ error: 'Crédito não encontrado' });
    }

    return res.json(credit);
  }

  async store(req, res) {
    try {
      const { userProvider } = req;

      if (!userProvider) {
        return res
          .status(401)
          .json({ error: 'Usuário não tem permissão criar créditos' });
      }
      const credit = await CreateCreditService.run({
        ...req.body,
      });

      return res.json(credit);
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
      const { userProvider } = req;

      const creditEdited = await UpdateCreditService.run({
        ...req.body,
        userProvider,
      });

      return res.json(creditEdited);
    } catch (error) {
      return res.status(500).json({
        error: 'Ocoreu um erro interno',
        messages: error,
        serverError: error,
      });
    }
  }

  async delete(req, res) {
    try {
      const { userProvider } = req;

      if (!userProvider) {
        return res.status(401).json({
          error: 'Usuário não tem permissão para deletar créditos',
        });
      }

      const { id } = req.params;

      const credit = await Credit.findByPk(id);

      if (!credit) {
        return res.status(400).json({ error: 'Crédito não encontrado' });
      }

      await Credit.destroy({
        where: { id },
      });

      return res.json('ok');
    } catch (error) {
      return res.status(500).json({
        error: 'Ocoreu um erro interno',
        messages: error,
        serverError: error,
      });
    }
  }
}

export default new CreditController();
