module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('speciality_types', load(), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('speciality_types', null, {});
  },
};

function load() {
  var list = [];
  for (let i = 1; i < data_array.length; i++) {
    list.push({
      name: data_array[i],
      active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  return list;
}

var data_array = [];
