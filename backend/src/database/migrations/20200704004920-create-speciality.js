module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('specialities', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      speciality_type_id: {
        type: Sequelize.INTEGER,
        references: { model: 'speciality_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      neighborhood: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      state: {
        type: Sequelize.STRING(2),
        allowNull: true,
      },

      street: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      complement: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      zip_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },

      latitude: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('specialities');
  },
};
