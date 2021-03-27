import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
  subHours,
} from 'date-fns';
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
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'url', 'image'],
        },
      ],
    });

    const available = speciality.scheduleFormated.scheduleConfig
      .filter(t => t.available === true)
      .map(time => {
        const [hour, minute] = time.time.split(':');
        const value = setSeconds(
          setMinutes(setHours(searchDate, hour), minute),
          0
        );
        const appointment = appointments.find(
          a => format(subHours(a.date, 3), 'HH:mm') === time.time
        );

        return {
          time: time.time,
          value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
          available:
            isAfter(value, new Date()) &&
            !appointments.find(a => format(subHours(a.date, 3), 'HH:mm') === time.time),
          isMine: appointment && appointment.user_id === user_id,
          id: appointment && appointment.user_id === user_id && appointment.id,
          appointment:
            appointment && appointment.user_id === user_id && appointment,
        };
      });

    return available;
  }
}

export default new AvailableService();
