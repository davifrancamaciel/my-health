module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('segments', load(), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('segments', null, {});
  },
};

function load() {
  var list = [];
  for (let i = 1; i < data_array.length; i++) {
    list.push({
      name: data_array[i],
      active: true,
      percentage: 40,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  return list;
}

var data_array = [
  'Medicina humana',
  'Medicina alternativa',
  'Exame Humano',
  'Cirurgia Humana',
  'Cirurgia',
  'Odontologia',
  'Exame Odontologia',
  'Consulta Veterinária',
  'Cirurgia Veterinária',
  'Exame veterinário',
];
