import ReportService from '../services/report/index';

class ReportController {
  async index(req, res) {
    const {
      start_date,
      end_date,
      speciality_id,
      speciality_type_id,
      segment_id,
      provider_id,
      type,
      provider_name,
      user_name,
    } = req.query;

    const appointments = await ReportService.run({
      speciality_id,
      speciality_type_id,
      segment_id,
      start_date,
      end_date,
      user_id: req.userId,
      provider_id,
      type,
      provider_name,
      user_name,
    });

    return res.json(appointments);
  }
}

export default new ReportController();
