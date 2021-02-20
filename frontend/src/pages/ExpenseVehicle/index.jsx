import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import CreateEdit from './CreateEdit'
import List from './List'
import Container from '../../components/_layouts/Container'

import getValidationErrors from '../../Utils/getValidationErrors'
import api from '../../services/api'
import history from '../../services/browserhistory'
import { formatPrice } from '../../Utils/formatPrice'

import { ContainerSpecialtyVehicle } from './styles'

const SpecialtyVehicleList = function () {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState({})
  const [title, setTitle] = useState()
  const [specialty, setSpecialty] = useState({})
  const [specialtiesList, setSpecialtiesList] = useState([])
  const [totalValue, setTotalValue] = useState()

  useEffect(() => {
    const total = specialtiesList.reduce((totalSum, specialty) => {
      return Number(totalSum) + Number(specialty.value)
    }, 0)
    setTotalValue(total)
  }, [specialtiesList])

  useEffect(() => {
    const complement = vehicle.brand
      ? `${vehicle.brand} ${vehicle.model}`
      : vehicle.model
    vehicle.model && setTitle(`Especialidades do veículo ${complement}`)
  }, [vehicle])

  useEffect(() => {
    if (id) {
      async function loadVehicle (id) {
        try {
          const response = await api.get(`vehicles/${id}`)
          setVehicle(response.data)
        } catch (error) {
          getValidationErrors(error)
          history.push('/vehicle')
        }
      }
      loadVehicle(id)
    } else {
      history.push('/vehicle')
    }
  }, [])

  return (
    <Container title={title}>
      <span>Total de especialidades {formatPrice(totalValue)}</span>
      <ContainerSpecialtyVehicle>
        <CreateEdit
          specialty={specialty}
          setSpecialtiesList={setSpecialtiesList}
          specialtiesList={specialtiesList}
          setSpecialty={setSpecialty}
        />
        <List
          setSpecialtiesList={setSpecialtiesList}
          setSpecialty={setSpecialty}
          specialtiesList={specialtiesList}
        />
      </ContainerSpecialtyVehicle>
    </Container>
  )
}

export default SpecialtyVehicleList
