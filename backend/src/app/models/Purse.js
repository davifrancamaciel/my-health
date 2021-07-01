import Sequelize, { Model } from 'sequelize';

class Purse extends Model {
  static init(sequelize) {
    super.init(
      {
        active: Sequelize.BOOLEAN,
        used: Sequelize.BOOLEAN,
        description: Sequelize.STRING,
        user_id: Sequelize.NUMBER,
        appointment_id: Sequelize.NUMBER,
        value: Sequelize.DECIMAL,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Purse;
