import Sequelize, { Model } from 'sequelize';

class SpecialityType extends Model {
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

export default SpecialityType;
