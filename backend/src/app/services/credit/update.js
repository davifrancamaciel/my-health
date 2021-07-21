import Credit from '../../models/Credit';
import User from '../../models/User';
import Mail from '../../../lib/Mail';

class UpdateCreditService {
  async run({
    id,
    user_id,
    description,
    value,
    active,
    used,
    appointment_id,
    sendMail,
    userProvider,
  }) {
    const credit = await Credit.findByPk(id);

    if (!credit) {
      throw new Error('Crédito não encontrado');
    }

    if (credit.used) {
      throw new Error(
        'Este crédito ja foi utilizado pelo usuario e não poderá ser alterado'
      );
    }

    if (!userProvider) {
      throw new Error('Você não possui permissão para alterar este crédito');
    }

    await credit.update({
      id,
      user_id,
      description,
      value,
      active,
      used,
      appointment_id,
    });

    const creditEdited = await Credit.findByPk(id);

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

    return creditEdited;
  }
}

export default new UpdateCreditService();
