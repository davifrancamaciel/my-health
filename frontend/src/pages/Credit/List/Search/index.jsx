import React, { useState } from 'react'
import { Form } from '@rocketseat/unform'
import { isBefore } from 'date-fns'

import Input from 'components/Inputs/Input'
import SubmitButton from 'components/SubmitButton'
import Datepicker from 'components/Inputs/Datepicker'
import FormSearchContainer from 'components/_layouts/FormSearchContainer'
import showToast from 'Utils/showToast'

export default function Search ({ onSearch, setPage }) {
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  function handleSubmit (data) {
    if (isBefore(endDate, startDate)) {
      showToast.error('A data inicial não pode ser maior que a final.')
      return
    }
    setPage(1)
    onSearch(data)
  }

  return (
    <FormSearchContainer>
      <Form onSubmit={handleSubmit}>
        <div className='field-group'>
          <div className='field'>
            <Input name='user_name' label='Nome' />
          </div>
          <div className='field'>
            <Input name='description' label='Descrição' />
          </div>
          <div className='field'>
            <Datepicker
              name='start_date'
              label='Data de'
              selected={startDate}
              onChange={setStartDate}
            />
          </div>
          <div className='field'>
            <Datepicker
              name='end_date'
              label='Data ate'
              selected={endDate}
              onChange={setEndDate}
            />
          </div>

          <div className='field'>
            <SubmitButton text={'Buscar'} />
          </div>
        </div>
      </Form>
    </FormSearchContainer>
  )
}
