import User from '../models/User';
import SpecialityType from '../models/SpecialityType';
import Speciality from '../models/Speciality';

class SpecialityProviderController {
  async find(req, res) {
    const { id } = req.params;

    const user = await Speciality.findOne({
      where: { id, active: true },
      attributes: [
        'zip_code',
        'state',
        'city',
        'neighborhood',
        'street',
        'complement',
        'value',
        'description'
      ],
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

    return res.json(user);
  }
}

export default new SpecialityProviderController();
