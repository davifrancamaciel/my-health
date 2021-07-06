import { Op } from 'sequelize';

import User from '../../models/User';

class UserIndexService {
  async run({ name, email, provider, page, orderBy, sorting }) {
    const whereStatement = {};

    if (provider != undefined) whereStatement.provider = provider;

    if (name)
      whereStatement.name = {
        [Op.iLike]: `%${name}%`,
      };

    if (email)
      whereStatement.email = {
        [Op.iLike]: `%${email}%`,
      };

    const orderQuery = orderBy || 'createdAt';
    const sortngQuery = sorting || 'DESC';

    const { count, rows } = await User.findAndCountAll({
      where: whereStatement,
      limit: 20,
      order: [[orderQuery, sortngQuery]],
      offset: (page - 1) * 20,
      attributes: [
        'id',
        'name',
        'crm',
        'image',
        'email',
        'whatsapp',
        'phone',
        'zip_code',
        'state',
        'city',
        'neighborhood',
        'street',
        'provider',
        'active',
        'image',
        'url',
        'createdAt',
        'latitude',
        'longitude',
      ],
    });

    return { count, rows };
  }
}

export default new UserIndexService();
