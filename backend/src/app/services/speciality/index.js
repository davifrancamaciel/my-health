import { Op } from 'sequelize';

import Speciality from '../../models/Speciality';
import SpecialityType from '../../models/SpecialityType';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

class SpecialityIndexService {
  async run({
    description,
    speciality_type_id,
    start_date,
    end_date,
    page,
    orderBy,
    sorting,
    limit,
    user_id,
  }) {
    let whereStatement = {
      user_id,
    };

    if (speciality_type_id) whereStatement.speciality_type_id = speciality_type_id;

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
      limit: limit ? limit : 20,
      order: [[orderQuery, sortngQuery]],
      offset: (page - 1) * 20,
      include: [
        {
          model: SpecialityType,
          as: 'type',
          attributes: ['name'],
        },
      ],
    });

    return { count, rows };
  }
}

export default new SpecialityIndexService();
