import Sequelize, { Model } from 'sequelize';
import bcrypty from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        image: Sequelize.STRING,
        email: Sequelize.STRING,
        whatsapp: Sequelize.STRING,
        phone: Sequelize.STRING,
        type: Sequelize.STRING,
        cpf_cnpj: Sequelize.STRING,
        cnh: Sequelize.STRING,
        rg: Sequelize.STRING,
        crm: Sequelize.STRING,
        profession: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        zip_code: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        street: Sequelize.STRING,
        complement: Sequelize.STRING,
        latitude: Sequelize.DECIMAL,
        longitude: Sequelize.DECIMAL,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        active: Sequelize.BOOLEAN,
        token_reset: Sequelize.STRING,
        validated: Sequelize.BOOLEAN,
        i_accept_term: Sequelize.BOOLEAN,
        roules: Sequelize.STRING,
        bank_agency: Sequelize.STRING,
        bank_account: Sequelize.STRING,
        bank_pix: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${
              this.image ? this.image : 'avatar.png'
            }`;
          },
        },
      },
      { sequelize }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypty.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypty.compare(password, this.password_hash);
  }
}

export default User;
