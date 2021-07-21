import ListCreditService from '../services/credit/ListProfile';

class CreditController {
  async index(req, res) {
    try {
      const credits = await ListCreditService.run({
        user_id: req.userId,
      });

      return res.json(credits);
    } catch (error) {
      return res.status(500).json({
        error: 'Ocoreu um erro interno',
        messages: error.inner,
        serveError: error,
      });
    }
  }
}

export default new CreditController();
