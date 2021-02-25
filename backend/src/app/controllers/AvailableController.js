import AvailableService from '../services/available/index';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Inavalid date' });
    }

    const searchDate = Number(date);
    const speciality_id = req.params.specialityId;

    const available = await AvailableService.run({
      searchDate,
      speciality_id,
    });

    return res.json(available);
  }
}

export default new AvailableController();
