import User from '../models/User';
import removeFile from '../utils/removeFile';

class ProfileController {
  async update(req, res) {
    try {
      const { userProvider } = req;
      const { email, oldPassword } = req.body;
      const user = await User.findByPk(req.userId);

      if (user.email !== email) {
        const userExist = await User.findOne({ where: { email } });
        if (userExist) {
          return res
            .status(400)
            .json({ error: 'Já existe um usuário com este email' });
        }
      }
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'A Senha antiga está icorreta' });
      }
      const userUpdate = req.body;
      if (!userProvider) {
        userUpdate.provider = false;
      }

      const image = (req.file && req.file.filename) || user.image;
      if (image !== user.image) {
        removeFile(user.image);
      }

      await user.update({ ...userUpdate, image });

      const { id, name, provider, whatsapp } = await User.findByPk(req.userId);

      return res.json({
        id,
        name,
        image,
        email,
        provider,
        whatsapp,
      });
    } catch (error) {
      if (req.file && req.file.filename) {
        removeFile(req.file.filename);
      }
      return res
        .status(500)
        .json({ error: 'Ocoreu um erro interno', messages: error.inner });
    }
  }
}

export default new ProfileController();
