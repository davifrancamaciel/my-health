import { parseISO } from 'date-fns';
import ReportService from '../services/report/index';

class ReportController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'A data está inválida' });
    }

    const searchDate = parseISO(date);
    //const speciality_id = req.params.specialityId;

    const appointments = await ReportService.run({
      searchDate,
      //speciality_id,
      user_id: req.userId,
    });

    return res.json(appointments);
  }
}

export default new ReportController();
