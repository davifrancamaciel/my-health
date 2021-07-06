import Purse from '../../models/Purse';

class ListPurseService {
  async run({ user_id }) {
    const purses = await Purse.findAll({
      where: { user_id },
      order: [['id', 'desc']],
    });

    return purses;
  }
}

export default new ListPurseService();
