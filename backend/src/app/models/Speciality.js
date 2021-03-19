import Sequelize, { Model } from 'sequelize';

class Speciality extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        speciality_type_id: Sequelize.NUMBER,
        value: Sequelize.DECIMAL,
        zip_code: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        street: Sequelize.STRING,
        complement: Sequelize.STRING,
        latitude: Sequelize.DECIMAL,
        longitude: Sequelize.DECIMAL,
        schedule: Sequelize.STRING,
        scheduleFormated: {
          type: Sequelize.VIRTUAL,
          get() {
            return JSON.parse(this.schedule);
          },
        },
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.SpecialityType, {
      foreignKey: 'speciality_type_id',
      as: 'type',
    });
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Speciality;
