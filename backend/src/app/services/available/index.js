import { startOfDay, endOfDay } from 'date-fns';
import Appointment from '../../models/Appointment';
import Speciality from '../../models/Speciality';
import User from '../../models/User';
import { Op } from 'sequelize';

class AvailableService {
  async run({ searchDate, speciality_id, user_id }) {
    const speciality = await Speciality.findByPk(speciality_id);

    if (!speciality) {
      throw new Error('Especialidade não encontrada');
    }

    const appointments = await Appointment.findAll({
      where: {
        [Op.or]: [
          { provider_id: speciality.user_id },
          { user_id: speciality.user_id },
          { provider_id: user_id },
          { user_id: user_id },
        ],
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      attributes: ['id', 'user_id', 'date', 'cancelable'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name'],
        },
      ],
    });

    const available = speciality.scheduleFormated.scheduleConfig
      .filter(t => t.available === true)
      .map(time => ({ time: time.time }));

    return { available, appointments };
  }
}

export default new AvailableService();
