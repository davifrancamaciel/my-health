import { Op } from 'sequelize';

import Specialty from '../../models/Specialty';
import SpecialtyType from '../../models/SpecialtyType';
import Vehicle from '../../models/Vehicle';
import SpecialtyTypeEnum from '../../enums/specialtyTypes';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

class SpecialtyIndexService {
  async run({
    description,
    specialty_type_id,
    start_date,
    end_date,
    page,
    orderBy,
    sorting,
    limit,
  }) {
    let whereStatement = {};

    if (specialty_type_id) whereStatement.specialty_type_id = specialty_type_id;

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

    const { count, rows } = await Specialty.findAndCountAll({
      where: whereStatement,
      limit: limit ? limit : 20,
      order: [[orderQuery, sortngQuery]],
      offset: (page - 1) * 20,
      include: [
        {
          model: SpecialtyType,
          as: 'type',
          attributes: ['name'],
        },
      ],
    });

    return { count, rows };
  }
}

export default new SpecialtyIndexService();
