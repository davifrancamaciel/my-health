import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Form } from '@rocketseat/unform'

import Container from 'components/_layouts/Container'
import SubmitButton from 'components/SubmitButton'
import FormContainer from 'components/_layouts/FormContainer'
import Input from 'components/Inputs/Input'
import InputMoney from 'components/Inputs/InputMoney'
import BackPage from 'components/BackPage'
import Select from 'components/Inputs/Select'

import showToast from 'Utils/showToast'
import api from 'services/api'
import history from 'services/browserhistory'
import getValidationErrors from 'Utils/getValidationErrors'
import { priceToNumber } from 'Utils/formatPrice'

import validation from './validation'

const SpecialtyCreateEdit = function () {
  const profile = useSelector((state) => state.user.profile);

  const { id } = useParams()
  const [specialty, setExpese] = useState({})
  const [loading, setLoading] = useState(false)
  const [types, setTypes] = useState([])

  useEffect(() => {
    if (!profile.provider){
      history.goBack();
      showToast.error('Para acessar esta as especialidades você precisa ser um Médico')
    } 
      
    async function loadSpecialtiesTypes () {
      try {
        const response = await api.get('specialties-types')
        setTypes(response.data)
      } catch (error) {
        getValidationErrors(error)
      }
    }
    loadSpecialtiesTypes()
  }, [])

  useEffect(() => {
    if (id) {
      async function loadSpecialty (id) {
        try {
          setLoading(true)
          const response = await api.get(`specialties/${id}`)

          setExpese(response.data)
          setLoading(false)
        } catch (error) {
          setLoading(false)
          getValidationErrors(error)
        }
      }
      loadSpecialty(id)
    }
  }, [])

  async function handleSubmit (data) {
    try {
      const saveSpecialty = {
        ...data,
        value: priceToNumber(data.value),
        id: id ? Number(id) : 0
      }

      setLoading(true)

      if (saveSpecialty.id) {
        await api.put('specialties', saveSpecialty)
      } else {
        await api.post('specialties', saveSpecialty)
      }

      showToast.success(`Especialidade salva com sucesso!`)

      setLoading(false)
      history.push(`/specialty`)
    } catch (error) {
      getValidationErrors(error)
      setLoading(false)
    }
  }

  return (
    <Container title={`Cadastro de especialidades`}>
      <FormContainer loading={loading}>
        <Form
          schema={validation()}
          onSubmit={handleSubmit}
          initialData={specialty}
        >
          <fieldset>
            <legend>
              <h2>Dados</h2>
              <BackPage />
            </legend>

            <div className='field-group'>
              <div className='field'>
                <Select
                  label='Tipo'
                  name='specialty_type_id'
                  options={types}
                  isDisabled={specialty.vehicle_id ? true : false}
                />
              </div>

              <div className='field'>
                <InputMoney name='value' label='Valor' />
              </div>
            </div>
            <div className='field'>
              <Input multiline name='description' label='Descrição' />
            </div>
          </fieldset>

          <SubmitButton loading={loading ? true : false} text={'Salvar'} />
        </Form>
      </FormContainer>
    </Container>
  )
}

export default SpecialtyCreateEdit
