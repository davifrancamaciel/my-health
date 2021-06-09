'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('appointments', 'value', {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      }),
      queryInterface.addColumn('appointments', 'provider_value', {
        type: Sequelize.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('appointments', 'value'),
      queryInterface.removeColumn('appointments', 'provider_value'),
    ]);
  },
};
