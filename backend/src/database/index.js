import Sequelize from 'sequelize'
import mongoose from 'mongoose'

import databaseConfig from '../config/database'
import Company from '../app/models/Company'
import User from '../app/models/User'
import Vehicle from '../app/models/Vehicle'
import Specialty from '../app/models/Specialty'
import SpecialtyType from '../app/models/SpecialtyType'
import File from '../app/models/File'
import Sale from '../app/models/Sale'

const models = [Company, User, Vehicle, Specialty, SpecialtyType, File, Sale]

class Database {
  constructor () {
    this.init()
    this.mongo()
  }

  init () {
    this.connection = new Sequelize(databaseConfig)

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models))
  }

  mongo () {
    this.mongooseConnection = mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    })
}
}

export default new Database()

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
