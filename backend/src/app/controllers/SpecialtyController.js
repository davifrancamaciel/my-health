import Specialty from '../models/Specialty'
import SpecialtyIndexService from '../services/specialty/index'

class SpecialtyController {
  async index (req, res) {
    const { userProvider } = req

    if (!userProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão para listar os especialidades' })
    }

    const {
      description,
      specialty_type_id,
      start_date,
      end_date,
      page = 1,
      orderBy,
      sorting,
      limit,
    } = req.query

    const { count, rows } = await SpecialtyIndexService.run({
      description,
      specialty_type_id,
      start_date,
      end_date,
      page,
      orderBy,
      sorting,
      limit,
    })

    res.header('X-Total-Count', count)

    return res.json({ count, rows })
  }

  async find (req, res) {
    const { id } = req.params

    const { userCompanyId, userCompanyProvider } = req

    const specialty = await Specialty.findByPk(id)
    if (!specialty) {
      return res.status(400).json({ error: 'especialidade não encontrada' })
    }

    if (!userCompanyProvider) {
      if (specialty.company_id != userCompanyId) {
        return res
          .status(401)
          .json({ error: 'Usuário não permissão ver esta especialidade' })
      }
    }

    return res.json(specialty)
  }

  async store (req, res) {
    try {
      const { userProvider, userCompanyId } = req

      if (!userProvider) {
        return res
          .status(401)
          .json({ error: 'Usuário não tem permissão criar especialidades' })
      }

      const specialty = await Specialty.create({
        ...req.body,
        company_id: userCompanyId,
      })

      return res.json(specialty)
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Ocoreu um erro interno', messages: error.inner })
    }
  }

  async update (req, res) {
    try {
      const { id } = req.body
      const { userCompanyProvider, userCompanyId } = req

      const specialty = await Specialty.findByPk(id)

      if (!specialty) {
        return res.status(400).json({ error: 'especialidade não encontrada' })
      }

      if (!userCompanyProvider && userCompanyId !== specialty.company_id) {
        return res.status(401).json({
          error: 'Você não possui permissão para alterar esta especialidade',
        })
      }

      await specialty.update({
        ...req.body,
        company_id: userCompanyId,
      })

      const specialtyEdited = await Specialty.findByPk(id)

      return res.json(specialtyEdited)
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Ocoreu um erro interno', messages: error })
    }
  }

  async delete (req, res) {
    const { userCompanyProvider, userProvider, userCompanyId } = req

    if (!userProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não tem permissão para deletar as especialidades' })
    }

    const { id } = req.params

    const specialty = await Specialty.findByPk(id)

    if (!specialty) {
      return res.status(400).json({ error: 'especialidade não encontrada' })
    }

    if (!userCompanyProvider && userCompanyId !== specialty.company_id) {
      return res.status(401).json({
        error: 'Não é possivel excluir um registro de outra loja',
      })
    }

    await Specialty.destroy({
      where: { id },
    })

    return res.json('ok')
  }
}

export default new SpecialtyController()
