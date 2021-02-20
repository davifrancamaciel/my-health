import React, { useState, useEffect } from 'react'
import api from '../../../../services/api'
import { formatPrice } from '../../../../Utils/formatPrice'
import SpecialtyTypeEnum from '../../../../enums/specialtyTypes'

import { Container, Td } from './styles'

const ProfitExpectation = ({ vehicle, values }) => {
  const [specialtiesList, setSpecialtiesList] = useState([])
  const [totalSpecialtyValue, setTotalSpecialtyValue] = useState(0)

  useEffect(() => {
    async function loadSpecialties () {
      try {
        const response = await api.get('specialties', {
          params: {
            limit: 50,
            vehicle_id: vehicle.id,
            specialty_type_id: [
              SpecialtyTypeEnum.MULTA_PAGA,
              SpecialtyTypeEnum.DESPESA_VEICULO_NAO_VENDIDO,
              SpecialtyTypeEnum.DESPESA_VEICULO_VENDIDO
            ]
          }
        })
        setSpecialtiesList(response.data.rows)
      } catch (error) {}
    }

    vehicle.id && loadSpecialties()
  }, [vehicle])

  useEffect(() => {
    const total = specialtiesList.reduce((totalSum, specialty) => {
      return Number(totalSum) + Number(specialty.value)
    }, 0)
    setTotalSpecialtyValue(total)
  }, [specialtiesList])

  function renderRolw () {
    const value_sale_formated = formatPrice(values.value_sale || 0)
    const value_purchase_formated = formatPrice(values.value_purchase || 0)
    const value_specialty_formated = formatPrice(totalSpecialtyValue || 0)
    const value_profit =
      values.value_sale - values.value_purchase - totalSpecialtyValue || 0
    const value_profit_formated = formatPrice(value_profit)

    return (
      <tr>
        <td>{value_sale_formated}</td>
        <td>{value_purchase_formated}</td>
        <td>{value_specialty_formated}</td>
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
