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
import SpecialityTypeEnum from '../../../enums/specialityTypes'

import { Ul } from '../../../components/_layouts/ListContainer/styles'
import { Main } from './styles'

const SpecialityList = function ({ setSpecialitiesList, setSpeciality, specialitiesList }) {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadSpecialities () {
      try {
        setLoading(true)

        const response = await api.get('specialities', {
          params: {
            limit: 50,
            vehicle_id: id,
            speciality_type_id: [
              SpecialityTypeEnum.MULTA_PAGA,
              SpecialityTypeEnum.MULTA_NAO_PAGA
            ]
          }
        })

        const data = response.data.rows.map(speciality => ({
          ...speciality,
          valueFormated: formatPrice(speciality.value),
          createdAtFormatedDate: `Cadastrada no dia ${format(
            parseISO(speciality.createdAt),
            "d 'de' MMMM",
            { locale: pt }
          )}`
        }))

        setSpecialitiesList(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        getValidationErrors(error)
      }
    }

    loadSpecialities()
  }, [])

  async function handleDelete (item) {
    ShowConfirm(
      'Atenção',
      `Confirma a remoção do auto de infração ${item.description}?`,
      () => handleDeleteConfirm(item.id)
    )
  }

  async function handleDeleteConfirm (id) {
    try {
      setLoading(true)
      await api.delete(`specialities/${id}`)

      showToast.success('Multa excluída com sucesso!')
      const updateSpecialities = specialitiesList.filter(c => c.id !== id)
      setSpecialitiesList(updateSpecialities)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      getValidationErrors(error)
    }
  }

  function handleUpdate (id) {
    const selectedSpeciality = specialitiesList.find(x => x.id == id)
    setSpeciality(selectedSpeciality)
  }

  return (
    <Container loading={loading ? Boolean(loading) : undefined}>
      <Main>
        <Ul>
          {specialitiesList.map(speciality => (
            <ListItem
              item={speciality}
              key={speciality.id}
              onUpdateClick={handleUpdate}
              onDeleteClick={handleDelete}
            />
          ))}
        </Ul>
      </Main>
    </Container>
  )
}

export default SpecialityList
