import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import Speciality from '../app/models/Speciality';
import SpecialityType from '../app/models/SpecialityType';
import Appointment from '../app/models/Appointment';

const models = [User, Speciality, SpecialityType, Appointment];

class Database {
  constructor() {
    this.init();
  }

  init() {

    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();

/*
ANOTAÇÕES
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
docker run --name mongobarber -p 27017:27017 -d -t mongo
docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
modo para criar migrations
yarn sequelize migration:create --name create-users
yarn sequelize migration:create --name create-files
yarn sequelize migration:create --name add-avatar-field-to-users
yarn sequelize db:migrate

multer biblioteca para upload de arquivos
*/
