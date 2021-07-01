// agenda do prestador de servico
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import Speciality from '../models/Speciality';
import SpecialityType from '../models/SpecialityType';

class ScheduleController {
  async index(req, res) {
    const user = await User.findOne({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
      });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const whereStatement = {
      canceled_at: null,
      date: {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
      },
      [Op.or]: [{ provider_id: req.userId }, { user_id: req.userId }],
    };

    const appointments = await Appointment.findAll({
      where: whereStatement,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'url', 'image'],
        },
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'url', 'image'],
        },
        {
          model: Speciality,
          as: 'speciality',
          attributes: ['id', 'value'],
          include: [
            {
              model: SpecialityType,
              as: 'type',
              attributes: ['name'],
            },
          ],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
