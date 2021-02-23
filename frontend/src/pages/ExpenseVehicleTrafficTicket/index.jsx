import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import CreateEdit from './CreateEdit'
import List from './List'
import Container from '../../components/_layouts/Container'

import getValidationErrors from '../../Utils/getValidationErrors'
import api from '../../services/api'
import history from '../../services/browserhistory'
import { formatPrice } from '../../Utils/formatPrice'

import { ContainerSpecialityVehicle } from './styles'

const SpecialityVehicleList = function () {
  const { id } = useParams()
  const [vehicle, setVehicle] = useState({})
  const [title, setTitle] = useState()
  const [speciality, setSpeciality] = useState({})
  const [specialitiesList, setSpecialitiesList] = useState([])
  const [totalValue, setTotalValue] = useState()

  useEffect(() => {
    const total = specialitiesList.reduce((totalSum, speciality) => {
      return Number(totalSum) + Number(speciality.value)
    }, 0)
    setTotalValue(total)
  }, [specialitiesList])

  useEffect(() => {
    const complement = vehicle.brand
      ? `${vehicle.brand} ${vehicle.model}`
      : vehicle.model
    vehicle.model && setTitle(`Multas do veículo ${complement}`)
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
      <span>Total de multas {formatPrice(totalValue)}</span>
      <ContainerSpecialityVehicle>
        <CreateEdit
          speciality={speciality}
          setSpecialitiesList={setSpecialitiesList}
          specialitiesList={specialitiesList}
          setSpeciality={setSpeciality}
        />
        <List
          setSpecialitiesList={setSpecialitiesList}
          setSpeciality={setSpeciality}
          specialitiesList={specialitiesList}
        />
      </ContainerSpecialityVehicle>
    </Container>
  )
}

export default SpecialityVehicleList
