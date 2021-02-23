import React, { useState, useEffect } from 'react'
import api from '../../../../services/api'
import { formatPrice } from '../../../../Utils/formatPrice'
import SpecialityTypeEnum from '../../../../enums/specialityTypes'

import { Container, Td } from './styles'

const ProfitExpectation = ({ selectedVehicle, setValueSaleVehicle,  }) => {
  const [specialitiesList, setSpecialitiesList] = useState([])
  const [totalSpecialityValue, setTotalSpecialityValue] = useState(0)
  const [vehicle, setVehicle] = useState({})

  useEffect(() => {
    async function loadSpecialities () {
      try {
        const response = await api.get('specialities', {
          params: {
            limit: 50,
            vehicle_id: selectedVehicle.value,
            speciality_type_id: [
              SpecialityTypeEnum.MULTA_PAGA,
              // SpecialityTypeEnum.MULTA_NAO_PAGA,
              SpecialityTypeEnum.DESPESA_VEICULO_NAO_VENDIDO,
              SpecialityTypeEnum.DESPESA_VEICULO_VENDIDO
            ]            
          }
        })
        setSpecialitiesList(response.data.rows)
      } catch (error) {}
    }

    selectedVehicle.value && loadSpecialities()

    async function loadVehicle () {
      try {
        const response = await api.get(`vehicles/${selectedVehicle.value}`)
        setVehicle(response.data)
        setValueSaleVehicle(response.data.value_sale)
      } catch (error) {}
    }

    selectedVehicle.value && loadVehicle()
  }, [selectedVehicle])

  useEffect(() => {
    const total = specialitiesList.reduce((totalSum, speciality) => {
      return Number(totalSum) + Number(speciality.value)
    }, 0)
    setTotalSpecialityValue(total)
  }, [specialitiesList])

  function renderRolw () {
    const value_sale_formated = formatPrice(vehicle.value_sale || 0)
    const value_purchase_formated = formatPrice(vehicle.value_purchase || 0)
    const value_speciality_formated = formatPrice(totalSpecialityValue || 0)
    const value_profit =
      vehicle.value_sale - vehicle.value_purchase - totalSpecialityValue || 0
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
      <h2>Expectativa de lucro para o veículo selecionado</h2>
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
