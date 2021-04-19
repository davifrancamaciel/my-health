import { Op } from 'sequelize';

import SpecialityType from '../models/SpecialityType';
import Speciality from '../models/Speciality';
import User from '../models/User';
import AppointmentCreateService from '../services/appointment/create';
import AppointmentCancelService from '../services/appointment/cancel';
import AppointmentFindService from '../services/appointment/find';

class AppointmentController {
  async index(req, res) {
    const { userId } = req;

    const { speciality_type_id, latitude, longitude, page = 1 } = req.query;

    let whereStatement = {
      active: true,
      user_id: {
        [Op.ne]: userId,
      },
    };

    if (speciality_type_id)
      whereStatement.speciality_type_id = speciality_type_id;

    const { count, rows } = await Speciality.findAndCountAll({
      where: whereStatement,
      limit: 20,
      offset: (page - 1) * 2000,
      attributes: ['id', 'latitude', 'longitude'],
      include: [
        {
          model: SpecialityType,
          as: 'type',
          attributes: ['name'],
          where: { active: true },
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'image', 'url', 'whatsapp', 'email'],
          where: { provider: true, active: true },
        },
      ],
    });

    res.header('X-Total-Count', count);

    return res.json({ count, rows });
  }

  async find(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req;

      const appointment = await AppointmentFindService.run({ id, userId });

      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async store(req, res) {
    try {
      const {
        provider_id,
        date,
        speciality_id,
        speciality,
        dateFormatedComplete,
      } = req.body;

      const appointment = await AppointmentCreateService.run({
        provider_id,
        date,
        user_id: req.userId,
        speciality_id,
        speciality,
        dateFormatedComplete,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { dateFormatedComplete } = req.body;
      const appointment = await AppointmentCancelService.run({
        id,
        user_id: req.userId,
        dateFormatedComplete,
      });
      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new AppointmentController();
