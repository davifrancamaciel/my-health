import { Op } from 'sequelize';

import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Credit from '../../models/Credit';
import User from '../../models/User';

class CreditIndexService {
  async run({
    description,
    start_date,
    end_date,
    page,
    orderBy,
    sorting,
    limit,
    user_name,
  }) {
    const whereStatement = {};
    const whereStatementUser = {};

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

    if (user_name)
      whereStatementUser.name = {
        [Op.iLike]: `%${user_name}%`,
      };

    const orderQuery = orderBy || 'createdAt';
    const sortngQuery = sorting || 'DESC';

    const { count, rows } = await Credit.findAndCountAll({
      where: whereStatement,
      limit: limit || 20,
      order: [[orderQuery, sortngQuery]],
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
          where: whereStatementUser,
        },
      ],
    });

    return { count, rows };
  }
}

export default new CreditIndexService();
