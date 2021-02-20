import React, { useState, useEffect } from 'react'
import api from '../../../../services/api'
import { formatPrice } from '../../../../Utils/formatPrice'
import SpecialtyTypeEnum from '../../../../enums/specialtyTypes'

import { Container, Td } from './styles'

const ProfitExpectation = ({ selectedVehicle, setValueSaleVehicle,  }) => {
  const [specialtiesList, setSpecialtiesList] = useState([])
  const [totalSpecialtyValue, setTotalSpecialtyValue] = useState(0)
  const [vehicle, setVehicle] = useState({})

  useEffect(() => {
    async function loadSpecialties () {
      try {
        const response = await api.get('specialties', {
          params: {
            limit: 50,
            vehicle_id: selectedVehicle.value,
            specialty_type_id: [
              SpecialtyTypeEnum.MULTA_PAGA,
              // SpecialtyTypeEnum.MULTA_NAO_PAGA,
              SpecialtyTypeEnum.DESPESA_VEICULO_NAO_VENDIDO,
              SpecialtyTypeEnum.DESPESA_VEICULO_VENDIDO
            ]            
          }
        })
        setSpecialtiesList(response.data.rows)
      } catch (error) {}
    }

    selectedVehicle.value && loadSpecialties()

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
    const total = specialtiesList.reduce((totalSum, specialty) => {
      return Number(totalSum) + Number(specialty.value)
    }, 0)
    setTotalSpecialtyValue(total)
  }, [specialtiesList])

  function renderRolw () {
    const value_sale_formated = formatPrice(vehicle.value_sale || 0)
    const value_purchase_formated = formatPrice(vehicle.value_purchase || 0)
    const value_specialty_formated = formatPrice(totalSpecialtyValue || 0)
    const value_profit =
      vehicle.value_sale - vehicle.value_purchase - totalSpecialtyValue || 0
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
