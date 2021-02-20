import sequelize, { Op } from 'sequelize'
import {
  startOfMonth,
  endOfMonth,
  subYears,
  setMilliseconds,
  setSeconds,
  setMinutes,
  setHours,
} from 'date-fns'

import Company from '../models/Company'
import User from '../models/User'
import Vehicle from '../models/Vehicle'
import Specialty from '../models/Specialty'
import SpecialtyTypeEnum from '../enums/specialtyTypes'
import Sale from '../models/Sale'

class DashboardController {
  async index (req, res) {
    const { userCompanyProvider, userProvider, userCompanyId } = req

    try {
      let whereStatement = {}
      let companiesInactive = 0
      let companiesActive = 0
      let company = null
      let specialties = null
      let sales = null

      if (!userCompanyProvider) whereStatement.company_id = userCompanyId

      if (userCompanyProvider) {
        companiesActive = await Company.count({
          where: {
            provider: false,
            expires_at: {
              [Op.gte]: new Date(),
            },
          },
        })
        companiesInactive = await Company.count({
          where: {
            provider: false,
            expires_at: {
              [Op.lte]: new Date(),
            },
          },
        })
      } else {
        company = await Company.findOne({
          where: { id: userCompanyId },
          attributes: ['name', 'expires_at'],
        })
        const { count, rows } = await Specialty.findAndCountAll({
          attributes: ['value'],
          where: {
            company_id: userCompanyId,
            specialty_type_id: {
              [Op.notIn]: [
                SpecialtyTypeEnum.DESPESA_VEICULO_NAO_VENDIDO,
                SpecialtyTypeEnum.MULTA_NAO_PAGA,
              ],
            },
            createdAt: {
              [Op.between]: [startOfMonth(new Date()), endOfMonth(new Date())],
            },
          },
        })

        const total = rows.reduce((totalSum, specialty) => {
          return Number(totalSum) + Number(specialty.value)
        }, 0)

        specialties = {
          principal_text: count,
          secondary_text: total,
        }
        // sales = await getSales(userCompanyId)
      }

      const clientsActive = await User.count({
        where: { ...whereStatement, provider: false, active: true },
      })
      const clientsInactive = await User.count({
        where: { ...whereStatement, provider: false, active: false },
      })

      const vehiclesActive = await Vehicle.count({
        where: { ...whereStatement, active: true },
      })
      const vehiclesInactive = await Vehicle.count({
        where: { ...whereStatement, active: false },
      })

      const model = {
        specialties,
        company,
        companies: {
          principal_text: companiesActive + companiesInactive,
          secondary_text: `${companiesActive} com acesso e ${companiesInactive} sem acesso (expirado)`,
        },
        clients: {
          principal_text: clientsActive + clientsInactive,
          secondary_text: `${clientsActive} ativos e ${clientsInactive} inativos`,
        },
        vehicles: {
          principal_text: vehiclesActive + vehiclesInactive,
          secondary_text: `${vehiclesActive} ativos e ${vehiclesInactive} inativos`,
        },
      }

      return res.json(model)
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno', error })
    }
  }

  async getSpecialtiesGraph (req, res) {
    const { userCompanyId } = req

    const rows = await Specialty.findAll({
      attributes: ['value', 'createdAt'],
      order: [['createdAt', 'ASC']],
      where: {
        company_id: userCompanyId,
        specialty_type_id: {
          [Op.notIn]: [
            SpecialtyTypeEnum.DESPESA_VEICULO_NAO_VENDIDO,
            SpecialtyTypeEnum.MULTA_NAO_PAGA,
          ],
        },
        createdAt: {
          [Op.between]: [subYears(new Date(), 1), endOfMonth(new Date())],
        },
      },
    })

    const specialties = rows.map(specialty => {
      const date = setMilliseconds(
        setSeconds(setMinutes(setHours(specialty.createdAt, 0), 0), 0),
        0
      )
      return {
        value: specialty.value,
        date,
      }
    })

    var result = []
    specialties.reduce(function (res, value) {
      if (!res[value.date]) {
        res[value.date] = { date: value.date, value: 0 }
        result.push(res[value.date])
      }
      res[value.date].value += Number(value.value)
      return res
    }, {})

    return res.json(result)
  }

  async getSales (company_id) {
    const { count, rows } = await Sale.findAndCountAll({
      attributes: ['value'],
      where: {
        company_id,
        createdAt: {
          [Op.between]: [startOfMonth(new Date()), endOfMonth(new Date())],
        },
      },
    })

    const total = rows.reduce((totalSum, specialty) => {
      return Number(totalSum) + Number(specialty.value)
    }, 0)

    const sales = {
      principal_text: count,
      secondary_text: total,
    }
    return sales
  }
}
export default new DashboardController()
