import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Segment from '../../models/Segment';
import SpecialityType from '../../models/SpecialityType';
import Speciality from '../../models/Speciality';
import Appointment from '../../models/Appointment';
import User from '../../models/User';
import { Op } from 'sequelize';

class ReportService {
  async run({
    start_date,
    end_date,
    speciality_id,
    speciality_type_id,
    segment_id,
    user_id,
    provider_id,
    orderBy,
    sorting,
    type,
    provider_name,
    user_name,
  }) {
    const user = await User.findOne({
      where: { id: user_id },
      attributes: ['roules'],
    });

    let whereStatement = { canceled_at: null };
    let whereStatementProvider = {};
    let whereStatementUser = {};
    let whereStatementSpeciality = {};
    let whereStatementSpecialityType = {};
    let whereStatementSegmentType = {};

    if (type) whereStatementSegmentType.type = type;

    if (speciality_type_id)
      whereStatementSpeciality.speciality_type_id = speciality_type_id;

    if (segment_id) whereStatementSpecialityType.segment_id = segment_id;

    if (provider_id) whereStatement.provider_id = provider_id;

    if (user.roules !== 'ADMIN') {
      whereStatement.provider_id = user_id;
    }

    if (provider_name)
      whereStatementProvider.name = {
        [Op.iLike]: `%${provider_name}%`,
      };

    if (user_name)
      whereStatementUser.name = {
        [Op.iLike]: `%${user_name}%`,
      };

    if (speciality_id) whereStatement.speciality_id = speciality_id;

    if (start_date)
      whereStatement.date = {
        [Op.gte]: startOfDay(parseISO(start_date)),
      };
    if (end_date)
      whereStatement.date = {
        [Op.lte]: endOfDay(parseISO(end_date)),
      };
    if (start_date && end_date)
      whereStatement.date = {
        [Op.between]: [
          startOfDay(parseISO(start_date)),
          endOfDay(parseISO(end_date)),
        ],
      };

    const orderQuery = orderBy || 'date';
    const sortngQuery = sorting || 'DESC';

    const appointments = await Appointment.findAll({
      where: whereStatement,
      order: [[orderQuery, sortngQuery]],
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
          attributes: ['name','email'],
          where: whereStatementProvider,
        },
        {
          model: User,
          as: 'user',
          attributes: ['name','email'],
          where: whereStatementUser,
        },
        {
          model: Speciality,
          as: 'speciality',
          attributes: ['id', 'state', 'city', 'neighborhood', 'street'],
          where: whereStatementSpeciality,
          include: [
            {
              model: SpecialityType,
              as: 'type',
              attributes: ['name'],
              where: whereStatementSpecialityType,
              include: [
                {
                  model: Segment,
                  as: 'segment',
                  attributes: ['name', 'type'],
                  where: whereStatementSegmentType,
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
