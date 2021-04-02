import { parseISO, isBefore } from 'date-fns';

import User from '../../models/User';
import Appointment from '../../models/Appointment';
import Mail from '../../../lib/Mail';
import { Op } from 'sequelize';

class CreateAppontmentService {
  async run({
    provider_id,
    user_id,
    date,
    speciality_id,
    speciality,
    dateFormatedComplete,
  }) {
    if (provider_id === user_id) {
      throw new Error('Não é possível marcar uma consuta para você mesmo');
    }

    // verifiar se é um provedor de serviço
    const provider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!provider) {
      throw new Error('Somenete é possivel marcar consultas com médicos');
    }

    // checando se a data é retoativa
    const hourStart = parseISO(date);

    if (isBefore(hourStart, new Date())) {
      throw new Error('Não é permitido marcar para datas passadas');
    }
    //Checando se a data esta disponivel
    const checkAvailability = await Appointment.findOne({
      where: {
        date: hourStart,
        canceled_at: null,
        [Op.or]: [
          { provider_id: provider_id },
          { user_id: provider_id },
          { provider_id: user_id },
          { user_id: user_id },
        ],
      },
    });
    if (checkAvailability) {
      throw new Error('Este horário não está mais disponível');
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date,
      speciality_id,
    });

    // INICIO notificações aos envolvidos
    const user = await User.findByPk(user_id);

    Mail.sendMail({
      to: `${provider.name} <${provider.email}>`,
      subject: `Novo agendamento com ${user.name}`,
      template: 'new-appointment',
      context: {
        name: provider.name,
        email: provider.email,
        text: `Novo agendamento de ${speciality} com o paciente ${user.name} para o ${dateFormatedComplete}`,
        url: `${process.env.APP_URL_WEB}/appointment/details/${appointment.id}`,
      },
    });

    Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: `Consulta agendada com ${provider.name}`,
      template: 'new-appointment',
      context: {
        name: user.name,
        email: user.email,
        text: `Você tem uma consulta de ${speciality} agendada com ${provider.name} para o ${dateFormatedComplete}`,
        url: `${process.env.APP_URL_WEB}/appointment/details/${appointment.id}`,
      },
    });
    // FIM notificações aos envolvidos

    return appointment;
  }
}

export default new CreateAppontmentService();
