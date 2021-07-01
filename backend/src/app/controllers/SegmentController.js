import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Segment from '../models/Segment';
import SpecialityType from '../models/SpecialityType';

class SegmentController {
  async index(req, res) {
    const {
      name,
      type,
      start_date,
      end_date,
      page = 1,
      orderBy,
      sorting,
      limit,
    } = req.query;

    const whereStatement = {};

    if (type) whereStatement.type = type;

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

    const { count, rows } = await Segment.findAndCountAll({
      where: whereStatement,
      limit: limit || 20,
      order: [[orderQuery, sortngQuery]],
      offset: (page - 1) * 20,
    });

    return res.json({ count, rows });
  }

  async find(req, res) {
    const { id } = req.params;

    const segment = await Segment.findByPk(id);

    if (!segment) {
      return res.status(400).json({ error: 'Segmento não encontrado' });
    }

    return res.json(segment);
  }

  async store(req, res) {
    try {
      const { name, type } = req.body;

      const segmentExist = await Segment.findOne({
        where: { name, type },
      });

      if (segmentExist) {
        return res.status(400).json({
          error: `Já existe uma segmento com este nome e este tipo`,
        });
      }

      const segment = await Segment.create({
        ...req.body,
      });

      return res.json(segment);
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
      const { id, name, type } = req.body;

      const segmentExist = await Segment.findOne({
        where: { name, type },
      });

      if (segmentExist && segmentExist.id !== id) {
        return res.status(400).json({
          error: `Já existe uma outro segmento com este nome e este tipo`,
        });
      }

      const segment = await Segment.findByPk(id);

      if (!segment) {
        return res.status(400).json({ error: 'Segmento não encontrado' });
      }

      await segment.update({
        ...req.body,
      });

      const segmentEdited = await Segment.findByPk(id);

      return res.json(segmentEdited);
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

      const type = await SpecialityType.findOne({ where: { segment_id: id } });
      if (type) {
        return res.status(401).json({
          error:
            'Não é possivel excluir um registro que já possui itens vinculados',
        });
      }
      const segment = await Segment.findByPk(id);

      if (!segment) {
        return res
          .status(400)
          .json({ error: 'Tipo de Segmento não encontrado' });
      }

      await Segment.destroy({
        where: { id },
      });

      return res.json('ok');
    } catch (error) {
      if (error && error.original.column.includes('segment_id')) {
        return res.status(401).json({
          error:
            'Não é possivel excluir um registro que já possui itens vinculados',
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
    const { active, order } = req.query;

    const whereStatement = {};
    if (active !== undefined) whereStatement.active = active === 'true';

    const orderBy = order || 'type';

    const types = await Segment.findAll({
      order: [orderBy],
      attributes: ['id', 'name', 'percentage', 'type'],
      where: whereStatement,
    });

    const typesFormated = types.map(item => ({
      type: item.type,
      percentage: item.percentage,
      id: item.id,
      title: item.name,
      value: item.id,
      label: item.name,
    }));

    return res.json(typesFormated);
  }
}

export default new SegmentController();
