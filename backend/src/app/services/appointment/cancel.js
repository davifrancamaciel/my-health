import { isBefore, subHours, format } from 'date-fns';

import User from '../../models/User';
import Appointment from '../../models/Appointment';
import Speciality from '../../models/Speciality';
import SpecialityType from '../../models/SpecialityType';
import pt from 'date-fns/locale/pt';

import Mail from '../../../lib/Mail';

class AppointmentCancelService {
  async run({ id, user_id }) {
    let appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
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
    });

    if (
      appointment.user_id !== user_id &&
      appointment.provider_id !== user_id
    ) {
      throw new Error('Você não tem permissão para cancelar este agendamento');
    }

    // metodo subHours para remover 2 horas da data do agendamento
    const dateWithSub = subHours(appointment.date, 2);

    // verifica se a hora do agendamento menos 2h é menor(antes) que a hora atual
    if (isBefore(dateWithSub, new Date())) {
      throw new Error('Somente é permitido cancelar com 2h de antecedencia');
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    // INICIO notificações aos envolvidos

    const formatedDate = format(
      appointment.date,
      "'dia' dd 'de' MMMM', ' eeee', às' H:mm'h'",
      {
        locale: pt,
      }
    );

    Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancelation',
      context: {
        name: appointment.provider.name,
        email: appointment.provider.email,
        provider: appointment.provider.name,
        user: appointment.user.name,
        speciality: appointment.speciality.type.name,
        date: formatedDate,
      },
    });

    Mail.sendMail({
      to: `${appointment.user.name} <${appointment.user.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancelation',
      context: {
        name: appointment.user.name,
        email: appointment.user.email,
        user: appointment.user.name,
        provider: appointment.provider.name,
        speciality: appointment.speciality.type.name,
        date: formatedDate,
      },
    });
    // FIM notificações aos envolvidos

    return { appointment, formatedDate };
  }
}

export default new AppointmentCancelService();
