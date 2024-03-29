import Credit from '../../models/Credit';
import User from '../../models/User';
import Mail from '../../../lib/Mail';

class CreateCreditService {
  async run({
    user_id,
    description,
    value,
    active,
    used,
    appointment_id,
    sendMail,
  }) {
    const credit = await Credit.create({
      user_id,
      description,
      value,
      active,
      used,
      appointment_id,
    });

    if (sendMail) {
      const user = await User.findByPk(user_id);

      Mail.sendMail({
        to: `${user.name} <${user.email}>`,
        subject: `Novo crédito no valor de ${value}`,
        template: 'credit',
        context: {
          // text: `Novo agendamento de ${speciality} com o paciente ${user.name} para o ${dateFormatedComplete}`,
          url: `${process.env.APP_URL_WEB}/profile?credit`,
        },
      });
    }

    return credit;
  }
}

export default new CreateCreditService();
