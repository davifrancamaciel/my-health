import PurseIndexService from '../services/purse/index';
import CreatePurseService from '../services/purse/create';
// import Purse from './models/Purse';

class PurseController {
  // async index(req, res) {
  //   const { userProvider, userId } = req;

  //   if (!userProvider) {
  //     return res.status(401).json({
  //       error: 'Usuário não tem permissão para listar os especialidades',
  //     });
  //   }

  //   const {
  //     description,
  //     start_date,
  //     end_date,
  //     page = 1,
  //     orderBy,
  //     sorting,
  //     limit,
  //     type,
  //     segment_id,
  //     speciality_type_id,
  //   } = req.query;

  //   const { count, rows } = await PurseIndexService.run({
  //     description,
  //     start_date,
  //     end_date,
  //     page,
  //     orderBy,
  //     sorting,
  //     limit,
  //     user_id: userId,
  //     type,
  //     segment_id,
  //     speciality_type_id,
  //   });

  //   res.header('X-Total-Count', count);

  //   return res.json({ count, rows });
  // }

  // async find(req, res) {
  //   const { id } = req.params;

  //   const { userId } = req;

  //   const speciality = await Purse.findByPk(id, {
  //     include: [
  //       {
  //         model: SpecialityType,
  //         as: 'type',
  //         attributes: ['name', 'value', 'segment_id'],
  //         include: [
  //           {
  //             model: Segment,
  //             as: 'segment',
  //             attributes: ['name', 'percentage'],
  //           },
  //         ],
  //       },
  //     ],
  //   });
  //   if (!speciality) {
  //     return res.status(400).json({ error: 'Especialidade não encontrada' });
  //   }

  //   if (speciality.user_id !== userId) {
  //     return res
  //       .status(401)
  //       .json({ error: 'Usuário não permissão ver esta especialidade' });
  //   }

  //   return res.json(speciality);
  // }

  async store(req, res) {
    try {
      const { userProvider } = req;

      if (!userProvider) {
        return res
          .status(401)
          .json({ error: 'Usuário não tem permissão criar especialidades' });
      }
      const purse = await PurseIndexService.run({
        ...req.body,
      });

      return res.json(purse);
    } catch (error) {
      return res.status(500).json({
        error: 'Ocoreu um erro interno',
        messages: error.inner,
        serveError: error,
      });
    }
  }

  // async update(req, res) {
  //   try {
  //     const { id } = req.body;
  //     const { userProvider, userId } = req;

  //     const speciality = await Purse.findByPk(id);

  //     if (!speciality) {
  //       return res.status(400).json({ error: 'Especialidade não encontrada' });
  //     }

  //     if (!userProvider || userId !== speciality.user_id) {
  //       return res.status(401).json({
  //         error: 'Você não possui permissão para alterar esta especialidade',
  //       });
  //     }

  //     await speciality.update({
  //       ...req.body,
  //       user_id: userId,
  //       schedule: JSON.stringify(req.body.schedule),
  //     });

  //     const specialityEdited = await Purse.findByPk(id);

  //     return res.json(specialityEdited);
  //   } catch (error) {
  //     return res.status(500).json({
  //       error: 'Ocoreu um erro interno',
  //       messages: error,
  //       serverError: error,
  //     });
  //   }
  // }

  // async delete(req, res) {
  //   try {
  //     const { userProvider, userId } = req;

  //     if (!userProvider) {
  //       return res.status(401).json({
  //         error: 'Usuário não tem permissão para deletar as especialidades',
  //       });
  //     }

  //     const { id } = req.params;

  //     const speciality = await Purse.findByPk(id);

  //     if (!speciality) {
  //       return res.status(400).json({ error: 'especialidade não encontrada' });
  //     }

  //     if (userId !== speciality.user_id) {
  //       return res.status(401).json({
  //         error: 'Não é possivel excluir um registro de outro medico',
  //       });
  //     }

  //     await Purse.destroy({
  //       where: { id },
  //     });

  //     return res.json('ok');
  //   } catch (error) {
  //     if (error && error.original.column.includes('speciality_id')) {
  //       return res.status(401).json({
  //         error:
  //           'Não é possivel excluir um registro que já possui agendamentos',
  //         serveError: error,
  //       });
  //     }
  //     return res.status(500).json({
  //       error: 'Ocoreu um erro interno',
  //       messages: error,
  //       serverError: error,
  //     });
  //   }
  // }
}

export default new PurseController();
