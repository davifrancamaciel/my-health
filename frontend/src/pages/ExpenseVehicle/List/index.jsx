import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { parseISO, format } from 'date-fns'
import pt from 'date-fns/locale/pt'

import Container from '../../../components/_layouts/Container'
import ShowConfirm from '../../../components/ShowConfirm'
import ListItem from './ListItem'

import api from '../../../services/api'
import getValidationErrors from '../../../Utils/getValidationErrors'
import showToast from '../../../Utils/showToast'
import { formatPrice } from '../../../Utils/formatPrice'
import SpecialtyTypeEnum from '../../../enums/specialtyTypes'

import { Ul } from '../../../components/_layouts/ListContainer/styles'
import { Main } from './styles'

const SpecialtyList = function ({ setSpecialtiesList, setSpecialty, specialtiesList }) {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadSpecialties () {
      try {
        setLoading(true)

        const response = await api.get('specialties', {
          params: {
            limit: 50,
            vehicle_id: id,
            specialty_type_id: [
              SpecialtyTypeEnum.DESPESA_VEICULO_NAO_VENDIDO,
              SpecialtyTypeEnum.DESPESA_VEICULO_VENDIDO
            ]
          }
        })

        const data = response.data.rows.map(specialty => ({
          ...specialty,
          valueFormated: formatPrice(specialty.value),
          createdAtFormatedDate: `Cadastrada no dia ${format(
            parseISO(specialty.createdAt),
            "d 'de' MMMM",
            { locale: pt }
          )}`
        }))

        setSpecialtiesList(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        getValidationErrors(error)
      }
    }

    loadSpecialties()
  }, [])

  async function handleDelete (item) {
    ShowConfirm(
      'Atenção',
      `Confirma a remoção da especialidade de ${formatPrice(item.value)}?`,
      () => handleDeleteConfirm(item.id)
    )
  }

  async function handleDeleteConfirm (id) {
    try {
      setLoading(true)
      await api.delete(`specialties/${id}`)

      showToast.success('Especialidade excluída com sucesso!')
      const updateSpecialties = specialtiesList.filter(c => c.id !== id)
      setSpecialtiesList(updateSpecialties)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      getValidationErrors(error)
    }
  }

  function handleUpdate (id) {
    const selectedSpecialty = specialtiesList.find(x => x.id == id)
    setSpecialty(selectedSpecialty)
  }

  return (
    <Container loading={loading ? Boolean(loading) : undefined}>
      <Main>
        <Ul>
          {specialtiesList.map(specialty => (
            <ListItem
              item={specialty}
              key={specialty.id}
              onUpdateClick={handleUpdate}
              onDeleteClick={handleDelete}
            />
          ))}
        </Ul>
      </Main>
    </Container>
  )
}

export default SpecialtyList
