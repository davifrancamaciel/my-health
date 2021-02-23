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
import SpecialityTypeEnum from '../../../enums/specialityTypes'
import validation from './validation'

import { ContainerSpecialityVehicleForm } from './styles'

const INITIAL_STATE = {
  id: 0,
  description: '',
  value: null
}

export default function CreateEdit ({
  setSpeciality,
  speciality,
  setSpecialitiesList,
  specialitiesList
}) {
  const { id } = useParams()
  const vehicle_id = Number(id)
  const [loading, setLoading] = useState(false)

  async function handleSubmit (data) {
    try {
      const saveSpeciality = {
        ...data,
        value: priceToNumber(data.value),
        id: speciality ? Number(speciality.id) : 0,
        speciality_type_id: speciality.speciality_type_id
          ? Number(speciality.speciality_type_id)
          : SpecialityTypeEnum.MULTA_NAO_PAGA,
        vehicle_id
      }
      setSpeciality(saveSpeciality)
      setLoading(true)

      if (saveSpeciality.id) {
        const responseUpdate = await api.put('specialities', saveSpeciality)

        const specialitiesUpdated = specialitiesList.map(e => {
          if (e.id === responseUpdate.data.id) {
            return {
              ...e,
              value: responseUpdate.data.value,
              valueFormated: formatPrice(responseUpdate.data.value),
              description: responseUpdate.data.description
            }
          } else return { ...e }
        })
        setSpecialitiesList(specialitiesUpdated)
        setSpeciality(INITIAL_STATE)
      } else {
        const responseNew = await api.post('specialities', saveSpeciality)
        const newSpeciality = {
          ...responseNew.data,
          type: { name: 'Multa não paga' },
          valueFormated: formatPrice(responseNew.data.value),
          createdAtFormatedDate: `Cadastrada no dia ${format(
            parseISO(responseNew.data.createdAt),
            "d 'de' MMMM",
            { locale: pt }
          )}`
        }
        setSpecialitiesList([newSpeciality, ...specialitiesList])
        setSpeciality(INITIAL_STATE)
      }

      showToast.success(`Multa salva com sucesso!`)

      setLoading(false)
    } catch (error) {
      getValidationErrors(error)
      setLoading(false)
    }
  }

  return (
    <ContainerSpecialityVehicleForm>
      <FormContainer loading={loading}>
        <Form
          schema={validation()}
          onSubmit={handleSubmit}
          initialData={speciality}
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
    </ContainerSpecialityVehicleForm>
  )
}
