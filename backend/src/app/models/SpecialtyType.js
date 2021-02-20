import Sequelize, { Model } from 'sequelize';

class SpecialtyType extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        constant: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }
}

export default SpecialtyType;
