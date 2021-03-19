import Speciality from '../models/Speciality';
import SpecialityIndexService from '../services/speciality/index';

class SpecialityController {
  async index(req, res) {
    const { userProvider, userId } = req;

    if (!userProvider) {
      return res.status(401).json({
        error: 'Usuário não tem permissão para listar os especialidades',
      });
    }

    const {
      description,
      speciality_type_id,
      start_date,
      end_date,
      page = 1,
      orderBy,
      sorting,
      limit,
    } = req.query;

    const { count, rows } = await SpecialityIndexService.run({
      description,
      speciality_type_id,
      start_date,
      end_date,
      page,
      orderBy,
      sorting,
      limit,
      user_id: userId,
    });

    res.header('X-Total-Count', count);

    return res.json({ count, rows });
  }

  async find(req, res) {
    const { id } = req.params;

    const { userCompanyId, userCompanyProvider } = req;

    const speciality = await Speciality.findByPk(id);
    if (!speciality) {
      return res.status(400).json({ error: 'Especialidade não encontrada' });
    }

    if (!userCompanyProvider) {
      if (speciality.company_id != userCompanyId) {
        return res
          .status(401)
          .json({ error: 'Usuário não permissão ver esta especialidade' });
      }
    }

    return res.json(speciality);
  }

  async store(req, res) {
    try {
      const { userProvider, userId } = req;

      if (!userProvider) {
        return res
          .status(401)
          .json({ error: 'Usuário não tem permissão criar especialidades' });
      }

      const speciality = await Speciality.create({
        ...req.body,
        user_id: userId,
        schedule: JSON.stringify(req.body.schedule),
      });

      return res.json(speciality);
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
      const { id } = req.body;
      const { userProvider, userId } = req;

      const speciality = await Speciality.findByPk(id);

      if (!speciality) {
        return res.status(400).json({ error: 'Especialidade não encontrada' });
      }

      if (!userProvider || userId !== speciality.user_id) {
        return res.status(401).json({
          error: 'Você não possui permissão para alterar esta especialidade',
        });
      }

      await speciality.update({
        ...req.body,
        user_id: userId,
        schedule: JSON.stringify(req.body.schedule),
      });

      const specialityEdited = await Speciality.findByPk(id);

      return res.json(specialityEdited);
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
      const { userCompanyProvider, userProvider, userCompanyId } = req;

      if (!userProvider) {
        return res.status(401).json({
          error: 'Usuário não tem permissão para deletar as especialidades',
        });
      }

      const { id } = req.params;

      const speciality = await Speciality.findByPk(id);

      if (!speciality) {
        return res.status(400).json({ error: 'especialidade não encontrada' });
      }

      if (!userCompanyProvider && userCompanyId !== speciality.company_id) {
        return res.status(401).json({
          error: 'Não é possivel excluir um registro de outra loja',
        });
      }

      await Speciality.destroy({
        where: { id },
      });

      return res.json('ok');
    } catch (error) {
      if (error && error.original.column.includes('speciality_id')) {
        return res.status(401).json({
          error:
            'Não é possivel excluir um registro que já possui agendamentos',
          serveError: error,
        });
      }
    }
  }
}

export default new SpecialityController();
