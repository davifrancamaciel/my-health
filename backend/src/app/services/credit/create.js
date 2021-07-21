import Credit from '../../models/Credit';

class CreateCreditService {
  async run({ user_id, description, value, active, used, appointment_id }) {
    const credit = await Credit.create({
      user_id,
      description,
      value,
      active,
      used,
      appointment_id,
    });

    return credit;
  }
}

export default new CreateCreditService();
