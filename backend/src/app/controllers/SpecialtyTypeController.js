import { Op } from 'sequelize'
import SpecialtyType from '../models/SpecialtyType'
import SpecialtyTypeEnum from '../enums/specialtyTypes'

class SpecialtyTypeController {
  async index (req, res) {
    const types = await SpecialtyType.findAll({
      order: ['name'],
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [
            SpecialtyTypeEnum.DESPESA_VEICULO_VENDIDO,
            SpecialtyTypeEnum.DESPESA_VEICULO_NAO_VENDIDO,
            SpecialtyTypeEnum.MULTA_PAGA,
            SpecialtyTypeEnum.MULTA_NAO_PAGA,
          ],
        },
      },
    })

    const typesFormated = types.map(c => ({
      id: c.id,
      title: c.name,
      value: c.id,
      label: c.name,
    }))

    return res.json(typesFormated)
  }
}

export default new SpecialtyTypeController()
