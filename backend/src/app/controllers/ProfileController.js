import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

import User from '../models/User';
import removeFile from '../utils/removeFile';
import propertyValidate from '../utils/propertyValidate';

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
      // if (!userProvider) {
      //   userUpdate.provider = false;
      // }

      const image = (req.file && req.file.filename) || user.image;
      if (image !== user.image) {
        removeFile(user.image);
      }

      const userUpdateFormated = {
        ...userUpdate,
        birth_date: propertyValidate(userUpdate.birth_date),
        zip_code: propertyValidate(userUpdate.zip_code),
        state: propertyValidate(userUpdate.state),
        city: propertyValidate(userUpdate.city),
        neighborhood: propertyValidate(userUpdate.neighborhood),
        street: propertyValidate(userUpdate.street),
        complement: propertyValidate(userUpdate.complement),
        latitude: propertyValidate(userUpdate.latitude),
        longitude: propertyValidate(userUpdate.longitude),
      };

      await user.update({ ...userUpdateFormated, image });

      const {
        id,
        name,
        provider,
        whatsapp,
        phone,
        cpf_cnpj,
        cnh,
        rg,
        crm,
        profession,
        birth_date,
        zip_code,
        state,
        city,
        neighborhood,
        street,
        complement,
        latitude,
        longitude,
      } = await User.findByPk(req.userId);

      return res.json({
        id,
        name,
        image,
        email,
        provider,
        whatsapp,
        phone,
        cpf_cnpj,
        cnh,
        rg,
        crm,
        profession,
        birth_date,
        zip_code,
        state,
        city,
        neighborhood,
        street,
        complement,
        latitude,
        longitude,
        token: jwt.sign({ id, provider }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      if (req.file && req.file.filename) {
        removeFile(req.file.filename);
      }
      return res.status(500).json({
        error: 'Ocoreu um erro interno',
        messages: error.inner,
        serveError: error,
      });
    }
  }
}

export default new ProfileController();
