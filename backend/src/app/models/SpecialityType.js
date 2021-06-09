import Sequelize, { Model } from 'sequelize';

class SpecialityType extends Model {
  static init(sequelize) {
    super.init(
      {
        segment_id: Sequelize.NUMBER,
        name: Sequelize.STRING,
        value: Sequelize.DECIMAL,
        active: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }
  static associate(models) {
    this.belongsTo(models.Segment, {
      foreignKey: 'segment_id',
      as: 'segment',
    });
  }
}

export default SpecialityType;
