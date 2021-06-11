import { startOfDay, endOfDay } from 'date-fns';
import Segment from '../../models/Segment';
import SpecialityType from '../../models/SpecialityType';
import Speciality from '../../models/Speciality';
import Appointment from '../../models/Appointment';
import User from '../../models/User';
import { Op } from 'sequelize';

class ReportService {
  async run({ searchDate, speciality_id, user_id }) {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: ['roules'],
    });

    let whereStatement = {
      date: {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      },
    };

    if (user.roules !== 'ADMIN') {
      whereStatement.provider_id = user_id;
    }
    const appointments = await Appointment.findAll({
      where: whereStatement,
      // where: {
      //   // [Op.or]: [
      //   //   { provider_id: speciality.user_id },
      //   //   { user_id: speciality.user_id },
      //   //   { provider_id: user_id },
      //   //   { user_id: user_id },
      //   // ],
      //   // canceled_at: null,
      //   // date: {
      //   //   [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      //   // },
      // },
      attributes: [
        'id',
        'date',
        'cancelable',
        'value',
        'provider_value',
        'canceled_at',
      ],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: Speciality,
          as: 'speciality',
          attributes: ['id', 'state', 'city', 'neighborhood', 'street'],
          include: [
            {
              model: SpecialityType,
              as: 'type',
              attributes: ['name'],
              include: [
                {
                  model: Segment,
                  as: 'segment',
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    });

    return appointments;
  }
}

export default new ReportService();
