'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('segments', 'type', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'ESP_CLINICA',
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn('segments', 'type')]);
  },
};
