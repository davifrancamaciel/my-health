import Credit from '../../models/Credit';

class ListCreditService {
  async run({ user_id }) {
    const credits = await Credit.findAll({
      where: { user_id },
      order: [['id', 'desc']],
    });

    return credits;
  }
}

export default new ListCreditService();
