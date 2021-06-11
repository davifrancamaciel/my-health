import { Op } from 'sequelize';
import SpecialityType from '../models/SpecialityType';
import Segment from '../models/Segment';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

class SpecialityTypeController {
  async index(req, res) {
    const {
      name,
      start_date,
      end_date,
      page = 1,
      orderBy,
      sorting,
      limit,
      segment_id,
    } = req.query;

    let whereStatement = {};

    if (segment_id) whereStatement.segment_id = segment_id;

    if (name)
      whereStatement.name = {
        [Op.iLike]: `%${name}%`,
      };

    if (start_date)
      whereStatement.createdAt = {
        [Op.gte]: startOfDay(parseISO(start_date)),
      };
    if (end_date)
      whereStatement.createdAt = {
        [Op.lte]: endOfDay(parseISO(end_date)),
      };
    if (start_date && end_date)
      whereStatement.createdAt = {
        [Op.between]: [
          startOfDay(parseISO(start_date)),
          endOfDay(parseISO(end_date)),
        ],
      };

    const orderQuery = orderBy || 'createdAt';
    const sortngQuery = sorting || 'DESC';

    const { count, rows } = await SpecialityType.findAndCountAll({
      where: whereStatement,
      limit: limit ? limit : 20,
      order: [[orderQuery, sortngQuery]],
      offset: (page - 1) * 20,
      include: [
        {
          model: Segment,
          as: 'segment',
          attributes: ['name', 'percentage'],
        },
      ],
    });

    return res.json({ count, rows });
  }

  async find(req, res) {
    const { id } = req.params;

    const speciality = await SpecialityType.findByPk(id);

    if (!speciality) {
      return res.status(400).json({ error: 'Especialidade não encontrada' });
    }

    return res.json(speciality);
  }

  async store(req, res) {
    try {
      const specialityExist = await SpecialityType.findOne({
        where: { name: req.body.name },
      });

      if (specialityExist) {
        return res.status(400).json({
          error: `Já existe uma especilidade com este nome`,
        });
      }

      const speciality = await SpecialityType.create({
        ...req.body,
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

      const specialityExist = await SpecialityType.findOne({
        where: { name: req.body.name },
      });

      if (specialityExist && specialityExist.id !== id) {
        return res.status(400).json({
          error: `Já existe uma outra especilidade com este nome`,
        });
      }

      const speciality = await SpecialityType.findByPk(id);

      if (!speciality) {
        return res.status(400).json({ error: 'Especialidade não encontrada' });
      }

      await speciality.update({
        ...req.body,
      });

      const specialityEdited = await SpecialityType.findByPk(id);

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
      const { id } = req.params;

      const speciality = await SpecialityType.findByPk(id);

      if (!speciality) {
        return res
          .status(400)
          .json({ error: 'Tipo de especialidade não encontrada' });
      }

      await SpecialityType.destroy({
        where: { id },
      });

      return res.json('ok');
    } catch (error) {
      if (error && error.original.column.includes('speciality_type_id')) {
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

  async list(req, res) {
    const { active, segment_id } = req.query;

    let whereStatement = {};
    if (segment_id) whereStatement.segment_id = segment_id;

    if (active != undefined)
      whereStatement.active = active === 'true' ? true : false;

    const types = await SpecialityType.findAll({
      order: ['name'],
      attributes: ['id', 'name', 'value'],
      where: whereStatement,
    });

    const typesFormated = types.map(c => ({
      value_type: c.value,
      id: c.id,
      title: c.name,
      value: c.id,
      label: c.name,
    }));

    return res.json(typesFormated);
  }
}

export default new SpecialityTypeController();
