import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from '@rocketseat/unform'
import { parseISO, format } from 'date-fns'
import pt from 'date-fns/locale/pt'

import SubmitButton from '../../../components/SubmitButton'
import FormContainer from '../../../components/_layouts/FormContainer'
import BackPage from '../../../components/BackPage'
import InputMoney from '../../../components/Inputs/InputMoney'
import Input from '../../../components/Inputs/Input'
import Options from '../../Vehicle/List/Options'

import api from '../../../services/api'
import getValidationErrors from '../../../Utils/getValidationErrors'
import { priceToNumber } from '../../../Utils/formatPrice'
import showToast from '../../../Utils/showToast'
import { formatPrice } from '../../../Utils/formatPrice'
import SpecialtyTypeEnum from '../../../enums/specialtyTypes'
import validation from './validation'

import { ContainerSpecialtyVehicleForm } from './styles'

const INITIAL_STATE = {
  id: 0,
  description: '',
  value: null
}

export default function CreateEdit ({
  setSpecialty,
  specialty,
  setSpecialtiesList,
  specialtiesList
}) {
  const { id } = useParams()
  const vehicle_id = Number(id)
  const [loading, setLoading] = useState(false)

  async function handleSubmit (data) {
    try {
      const saveSpecialty = {
        ...data,
        value: priceToNumber(data.value),
        id: specialty ? Number(specialty.id) : 0,
        specialty_type_id: specialty.specialty_type_id
          ? Number(specialty.specialty_type_id)
          : SpecialtyTypeEnum.MULTA_NAO_PAGA,
        vehicle_id
      }
      setSpecialty(saveSpecialty)
      setLoading(true)

      if (saveSpecialty.id) {
        const responseUpdate = await api.put('specialties', saveSpecialty)

        const specialtiesUpdated = specialtiesList.map(e => {
          if (e.id === responseUpdate.data.id) {
            return {
              ...e,
              value: responseUpdate.data.value,
              valueFormated: formatPrice(responseUpdate.data.value),
              description: responseUpdate.data.description
            }
          } else return { ...e }
        })
        setSpecialtiesList(specialtiesUpdated)
        setSpecialty(INITIAL_STATE)
      } else {
        const responseNew = await api.post('specialties', saveSpecialty)
        const newSpecialty = {
          ...responseNew.data,
          type: { name: 'Multa não paga' },
          valueFormated: formatPrice(responseNew.data.value),
          createdAtFormatedDate: `Cadastrada no dia ${format(
            parseISO(responseNew.data.createdAt),
            "d 'de' MMMM",
            { locale: pt }
          )}`
        }
        setSpecialtiesList([newSpecialty, ...specialtiesList])
        setSpecialty(INITIAL_STATE)
      }

      showToast.success(`Multa salva com sucesso!`)

      setLoading(false)
    } catch (error) {
      getValidationErrors(error)
      setLoading(false)
    }
  }

  return (
    <ContainerSpecialtyVehicleForm>
      <FormContainer loading={loading}>
        <Form
          schema={validation()}
          onSubmit={handleSubmit}
          initialData={specialty}
        >
          <fieldset>
            <legend>
              <Options id={id} />
              <BackPage />
            </legend>

            <div className='field'>
              <Input name='description' label='Auto de infração' />
            </div>
            <div className='field'>
              <InputMoney name='value' label='Valor' />
            </div>
          </fieldset>

          <SubmitButton loading={loading ? true : false} text={'Salvar'} />
        </Form>
      </FormContainer>
    </ContainerSpecialtyVehicleForm>
  )
}
