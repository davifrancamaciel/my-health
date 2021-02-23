import { Op } from 'sequelize'
import SpecialityType from '../models/SpecialityType'
import SpecialityTypeEnum from '../enums/specialityTypes'

class SpecialityTypeController {
  async index (req, res) {
    const types = await SpecialityType.findAll({
      order: ['name'],
      attributes: ['id', 'name'],
      where: {
        id: {
          [Op.notIn]: [
            SpecialityTypeEnum.DESPESA_VEICULO_VENDIDO,
            SpecialityTypeEnum.DESPESA_VEICULO_NAO_VENDIDO,
            SpecialityTypeEnum.MULTA_PAGA,
            SpecialityTypeEnum.MULTA_NAO_PAGA,
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

export default new SpecialityTypeController()
