import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import Appointment from '../../models/Appointment';
import Speciality from '../../models/Speciality';
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
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      const appontment = appointments.find(
        a => format(a.date, 'HH:mm') === time
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
        isMine: appontment && appontment.user_id === user_id,
        id: appontment && appontment.user_id === user_id && appontment.id,
        // appontment,
        appointments
      };
    });

    return available;
  }
}

export default new AvailableService();
