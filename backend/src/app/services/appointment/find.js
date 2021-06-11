import User from '../../models/User';
import Appointment from '../../models/Appointment';
import Speciality from '../../models/Speciality';
import SpecialityType from '../../models/SpecialityType';
import Segment from '../../models/Segment';

const attributesUser = [
  'name',
  'image',
  'email',
  'whatsapp',
  'url',
  'phone',
  'crm',
];
class AppointmentFindService {
  async run({ id, userId }) {
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: attributesUser,
        },
        {
          model: User,
          as: 'user',
          attributes: attributesUser,
        },
        {
          model: Speciality,
          as: 'speciality',
          attributes: [
            'id',
            'value',
            'zip_code',
            'state',
            'city',
            'neighborhood',
            'street',
            'complement',
            'description',
          ],
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

    if (!appointment) {
      throw new Error('Agendamento não encontrado');
    }

    if (appointment.user_id !== userId && appointment.provider_id !== userId) {
      throw new Error(
        'Você não tem permissão para visualizar este agendamento'
      );
    }
    return appointment;
  }
}

export default new AppointmentFindService();
