module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      image: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      whatsapp: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },

      type: {
        type: Sequelize.STRING(1),
        allowNull: true,
        defaultValue: 'F',
      },

      cpf_cnpj: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      cnh: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      rg: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      crm: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      profession: {
        type: Sequelize.STRING(100),
        allowNull: true,
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

      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      roules: {
        type: Sequelize.STRING(200),
        allowNull: true,
        defaultValue: 'USER',
      },

      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      validated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      i_accept_term: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      birth_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      token_reset: {
        type: Sequelize.STRING(100),
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
    return queryInterface.dropTable('users');
  },
};
