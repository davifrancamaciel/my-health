import Sequelize, { Model } from 'sequelize';

class Specialty extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        specialty_type_id: Sequelize.NUMBER,
        value: Sequelize.DECIMAL,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.SpecialtyType, { foreignKey: 'specialty_type_id', as: 'type' });
  }
}

export default Specialty;
