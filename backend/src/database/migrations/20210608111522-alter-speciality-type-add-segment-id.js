'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('speciality_types', 'segment_id', {
        type: Sequelize.INTEGER,
        references: { model: 'segments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }),
      queryInterface.addColumn('speciality_types', 'value', {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('speciality_types', 'segment_id'),
      queryInterface.removeColumn('speciality_types', 'value'),
    ]);
  },
};
