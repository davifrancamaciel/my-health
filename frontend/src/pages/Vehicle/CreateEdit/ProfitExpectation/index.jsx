import React, { useState, useEffect } from 'react'
import api from '../../../../services/api'
import { formatPrice } from '../../../../Utils/formatPrice'
import SpecialityTypeEnum from '../../../../enums/specialityTypes'

import { Container, Td } from './styles'

const ProfitExpectation = ({ vehicle, values }) => {
  const [specialitiesList, setSpecialitiesList] = useState([])
  const [totalSpecialityValue, setTotalSpecialityValue] = useState(0)

  useEffect(() => {
    async function loadSpecialities () {
      try {
        const response = await api.get('specialities', {
          params: {
            limit: 50,
            vehicle_id: vehicle.id,
            speciality_type_id: [
              SpecialityTypeEnum.MULTA_PAGA,
              SpecialityTypeEnum.DESPESA_VEICULO_NAO_VENDIDO,
              SpecialityTypeEnum.DESPESA_VEICULO_VENDIDO
            ]
          }
        })
        setSpecialitiesList(response.data.rows)
      } catch (error) {}
    }

    vehicle.id && loadSpecialities()
  }, [vehicle])

  useEffect(() => {
    const total = specialitiesList.reduce((totalSum, speciality) => {
      return Number(totalSum) + Number(speciality.value)
    }, 0)
    setTotalSpecialityValue(total)
  }, [specialitiesList])

  function renderRolw () {
    const value_sale_formated = formatPrice(values.value_sale || 0)
    const value_purchase_formated = formatPrice(values.value_purchase || 0)
    const value_speciality_formated = formatPrice(totalSpecialityValue || 0)
    const value_profit =
      values.value_sale - values.value_purchase - totalSpecialityValue || 0
    const value_profit_formated = formatPrice(value_profit)

    return (
      <tr>
        <td>{value_sale_formated}</td>
        <td>{value_purchase_formated}</td>
        <td>{value_speciality_formated}</td>
        <Td damage={value_profit < 0}>{value_profit_formated}</Td>
      </tr>
    )
  }

  return (
    <Container>
      <p>Expectativa de lucro</p>
      <table>
        <thead>
          <tr>
            <th>Valor de venda</th>
            <th>Valor de compra</th>
            <th>Valor de especialidades</th>
            <th>Lucro liquido </th>
          </tr>
        </thead>
        <tbody>{renderRolw()}</tbody>
      </table>
    </Container>
  )
}

export default ProfitExpectation
