module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'bank_agency', {
        type: Sequelize.STRING(10),
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'bank_account', {
        type: Sequelize.STRING(10),
        allowNull: true,
      }),
      queryInterface.addColumn('users', 'bank_pix', {
        type: Sequelize.STRING(50),
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'bank_agency'),
      queryInterface.removeColumn('users', 'bank_account'),
      queryInterface.removeColumn('users', 'bank_pix'),
    ]);
  },
};
