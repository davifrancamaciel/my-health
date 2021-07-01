import Purse from '../../models/Purse';

class CreatePurseService {
  async run({ user_id, description, value, active, used, appointment_id }) {
    const purse = await Purse.create({
      user_id,
      description,
      value,
      active,
      used,
      appointment_id,
    });

    return purse;
  }
}

export default new CreatePurseService();
