import { Op } from 'sequelize';

import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Speciality from '../../models/Speciality';
import SpecialityType from '../../models/SpecialityType';
import Segment from '../../models/Segment';

class SpecialityIndexService {
  async run({
    description,
    start_date,
    end_date,
    page,
    orderBy,
    sorting,
    limit,
    user_id,
    type,
    segment_id,
    speciality_type_id,
  }) {
    const whereStatement = {
      user_id,
    };
    const whereStatementSegmentType = {};
    const whereStatementSpecialityType = {};

    if (type) whereStatementSegmentType.type = type;

    if (segment_id) whereStatementSpecialityType.segment_id = segment_id;

    if (speciality_type_id)
      whereStatement.speciality_type_id = speciality_type_id;

    if (description)
      whereStatement.description = {
        [Op.iLike]: `%${description}%`,
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

    const { count, rows } = await Speciality.findAndCountAll({
      where: whereStatement,
      limit: limit || 20,
      order: [[orderQuery, sortngQuery]],
      offset: (page - 1) * 20,
      include: [
        {
          model: SpecialityType,
          as: 'type',
          attributes: ['name', 'value'],
          where: whereStatementSpecialityType,
          include: [
            {
              model: Segment,
              as: 'segment',
              attributes: ['name', 'percentage', 'type'],
              where: whereStatementSegmentType,
            },
          ],
        },
      ],
    });

    return { count, rows };
  }
}

export default new SpecialityIndexService();
