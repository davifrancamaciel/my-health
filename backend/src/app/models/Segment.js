import Sequelize, { Model } from 'sequelize';

class Segment extends Model {
  static init(sequelize) {
    super.init(
      {
        percentage: Sequelize.NUMBER,
        name: Sequelize.STRING,
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }

}

export default Segment;
