module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'specialty_types',
      [
        {
          id: 1,
          name: 'Acupuntura',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'Alergia e Imunologia',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: 'Endocrinologia Pediátrica',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 4,
          name: 'Endoscopia Respiratória',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 5,
          name: 'Urologia',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 6,
          name: 'Radioterapia',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 7,
          name: 'Pediatria',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 8,
          name: 'Pneumologia',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 9,
          name: 'Neurologia',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 10,
          name: 'Ginecologia e Obstetrícia',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('specialty_types', null, {})
  },
}
