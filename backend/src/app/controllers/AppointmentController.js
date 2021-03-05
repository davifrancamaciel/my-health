import { Op } from 'sequelize';

import SpecialityType from '../models/SpecialityType';
import Speciality from '../models/Speciality';
import User from '../models/User';
import AppointmentCreateService from '../services/appointment/create';
import AppointmentCancelService from '../services/appointment/cancel';

class AppointmentController {
  async index(req, res) {
    const { userProvider, userId } = req;

    const { speciality_type_id, page = 1 } = req.query;

    let whereStatement = {
      active: true,
      user_id: {
        [Op.ne]: userId,
      },
    };

    if (speciality_type_id)
      whereStatement.speciality_type_id = speciality_type_id;
    // const orderQuery = orderBy || 'createdAt'
    // const sortngQuery = sorting || 'DESC'

    const { count, rows } = await Speciality.findAndCountAll({
      where: whereStatement,
      limit: 20,
      // order: [[orderQuery, sortngQuery]],
      offset: (page - 1) * 20,
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
    const { id } = req.params;

    const { userProvider, userCompanyId, userCompanyProvider } = req;

    if (!userCompanyProvider) {
      if (!userProvider || userCompanyId !== Number(id)) {
        return res
          .status(401)
          .json({ error: 'Usuário não permissão ver esta loja' });
      }
    }

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(400).json({ error: 'Loja não encontrada' });
    }

    return res.json(company);
  }

  async store(req, res) {
    try {
      const { provider_id, date, speciality_id, speciality } = req.body;

      const appointment = await AppointmentCreateService.run({
        provider_id,
        date,
        user_id: req.userId,
        speciality_id,
        speciality,
      });

      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const appointment = await AppointmentCancelService.run({
        id,
        user_id: req.userId,
      });
      return res.json(appointment);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new AppointmentController();
