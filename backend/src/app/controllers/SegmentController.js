import { Op } from 'sequelize';
import Segment from '../models/Segment';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

class SegmentController {
  async index(req, res) {
    const {
      name,
      start_date,
      end_date,
      page = 1,
      orderBy,
      sorting,
      limit,
    } = req.query;

    let whereStatement = {};

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
      limit: limit ? limit : 20,
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
      const segmentExist = await Segment.findOne({
        where: { name: req.body.name },
      });

      if (segmentExist) {
        return res.status(400).json({
          error: `Já existe uma segmento com este nome`,
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
      const { id } = req.body;

      const segmentExist = await Segment.findOne({
        where: { name: req.body.name },
      });

      if (segmentExist && segmentExist.id !== id) {
        return res.status(400).json({
          error: `Já existe uma outro segmento com este nome`,
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
    const { active } = req.query;

    let whereStatement = {};
    if (active != undefined)
      whereStatement.active = active === 'true' ? true : false;

    const types = await Segment.findAll({
      order: ['name'],
      attributes: ['id', 'name', 'percentage'],
      where: whereStatement,
    });

    const typesFormated = types.map(item => ({
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
