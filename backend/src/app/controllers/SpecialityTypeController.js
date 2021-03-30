import SpecialityType from '../models/SpecialityType';

class SpecialityTypeController {
  async index(req, res) {
    const types = await SpecialityType.findAll({
      order: ['name'],
      attributes: ['id', 'name'],
      where: { active: true },
    });

    const typesFormated = types.map(c => ({
      id: c.id,
      title: c.name,
      value: c.id,
      label: c.name,
    }));

    return res.json(typesFormated);
  }
}

export default new SpecialityTypeController();
