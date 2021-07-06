import ListPurseService from '../services/purse/ListProfile';

class PurseController {
  async index(req, res) {
    try {
      const purses = await ListPurseService.run({
        user_id: req.userId,
      });

      return res.json(purses);
    } catch (error) {
      return res.status(500).json({
        error: 'Ocoreu um erro interno',
        messages: error.inner,
        serveError: error,
      });
    }
  }
}

export default new PurseController();
