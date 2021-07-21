import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Form } from '@rocketseat/unform'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import Container from 'components/_layouts/Container'
import SubmitButton from 'components/SubmitButton'
import FormContainer from 'components/_layouts/FormContainer'
import Input from 'components/Inputs/Input'
import InputMoney from 'components/Inputs/InputMoney'
import Select from 'components/Inputs/Select'

import showToast from 'Utils/showToast'

import api from 'services/api'
import history from 'services/browserhistory'
import getValidationErrors from 'Utils/getValidationErrors'
import { priceToNumber } from 'Utils/formatPrice'

import validation from './validation'

const CreditCreateEdit = function () {
  const { id } = useParams()
  const [credit, setCredit] = useState({})
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(true)
  const [sendMail, setSendMail] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (id) {
      async function loadCredit (id) {
        try {
          setLoading(true)
          const response = await api.get(`credits/${id}`)

          setCredit(response.data)

          setActive(response.data.active)

          setLoading(false)
        } catch (error) {
          setLoading(false)
          getValidationErrors(error)
        }
      }
      loadCredit(id)
    }
    loadUsers()
  }, [id])

  async function loadUsers () {
    let whereStatement = {}
    if (!id) whereStatement.active = true

    const response = await api.get(`users/list`, {
      params: { ...whereStatement }
    })
    setUsers(response.data)
  }

  async function handleSubmit (data) {
    try {
      const saveCredit = {
        ...data,
        id: id ? Number(id) : 0,
        value: priceToNumber(data.value),
        active,
        sendMail
      }

      setLoading(true)

      if (saveCredit.id) {
        await api.put('credits', saveCredit)
      } else {
        await api.post('credits', saveCredit)
      }

      showToast.success(`Crédito salvo com sucesso!`)

      setLoading(false)
      history.push(`/credit`)
    } catch (error) {
      getValidationErrors(error)
      setLoading(false)
    }
  }

  return (
    <Container
      title={`Cadastro de créditos para usuários`}
      loading={loading}
      showBack
    >
      <FormContainer loading={loading}>
        <Form
          schema={validation()}
          onSubmit={handleSubmit}
          initialData={credit}
        >
          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>
            <div className='field'>
              <Select
                label='Usuário'
                name='user_id'
                options={users}
                isDisabled={credit.used}
              />
            </div>

            <div className='field'>
              <Input
                multiline
                name='description'
                label='Descrição'
                disabled={credit.used}
              />
            </div>
            <div className='field'>
              <InputMoney name='value' label='Valor' disabled={credit.used} />
            </div>

            {!credit.used && (
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    checked={active}
                    onChange={() => setActive(!active)}
                    name={`active`}
                  />
                }
                label={`Disponível para uso`}
              />
            )}
            {!credit.used && (
              <FormControlLabel
                control={
                  <Switch
                    color='primary'
                    checked={sendMail}
                    onChange={() => setSendMail(!active)}
                    name={`sendMail`}
                  />
                }
                label={`Desejo enviar um e-mail de notificação`}
              />
            )}
            {credit.used && (
              <p>
                Este crédito ja foi utilizado pelo usuario e não poderá ser
                alterado
              </p>
            )}
          </fieldset>

          {!credit.used && (
            <SubmitButton loading={loading ? true : false} text={'Salvar'} />
          )}
        </Form>
      </FormContainer>
    </Container>
  )
}

export default CreditCreateEdit
