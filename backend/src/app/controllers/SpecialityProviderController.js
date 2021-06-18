import User from '../models/User';
import Segment from '../models/Segment';
import SpecialityType from '../models/SpecialityType';
import Speciality from '../models/Speciality';

class SpecialityProviderController {
  async find(req, res) {
    try {
      const { id } = req.params;

      const user = await Speciality.findOne({
        where: { id, active: true },
        attributes: [
          'id',
          'zip_code',
          'state',
          'city',
          'neighborhood',
          'street',
          'complement',
          'value',
          'description',
          'schedule',
        ],
        include: [
          {
            model: SpecialityType,
            as: 'type',
            attributes: ['name', 'value'],
            include: [
              {
                model: Segment,
                as: 'segment',
                attributes: ['name', 'percentage', 'type'],
                where: { active: true },
              },
            ],
            where: { active: true },
          },
          {
            model: User,
            as: 'user',
            attributes: [
              'id',
              'name',
              'url',
              'email',
              'whatsapp',
              'image',
              'phone',
              'crm',
            ],
            where: { provider: true, active: true },
          },
        ],
      });
      if (!user) {
        return res.status(400).json({ error: 'Médico não encontrado' });
      }

      const scheduleConfig = JSON.parse(user.schedule);
      let userFormated = user;
      userFormated.schedule = scheduleConfig.daysWeekConfig;

      return res.json(userFormated);
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Ocoreu um erro interno', messages: error.inner });
    }
  }
}

export default new SpecialityProviderController();
