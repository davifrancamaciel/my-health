import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

import api from 'services/api'
import getValidationErrors from 'Utils/getValidationErrors'
import { formatPrice } from 'Utils/formatPrice'

import Container from 'components/_layouts/Container'
import { Main } from 'components/_layouts/ListContainer/styles'
import { Itens } from './styles'

function Purse () {
  const [loading, setLoading] = useState(false)
  const [purses, setPurses] = useState([])
  useEffect(() => {
    load()
  }, [])
  async function load () {
    try {
      setLoading(true)
      const response = await api.get('purses')

      const data = response.data.map(item => {
        const url = item.appointment_id
          ? `/appointment/details/${item.appointment_id}`
          : '#'
        let title = ''
        if ((item.active && item.used) || (!item.active && item.used)) {
          title = 'já utilizado'
        }
        if (!item.active && !item.used) {
          title = 'pendente de aprovação'
        }
        if (item.active && !item.used) {
          title = 'disponível para procedimentos'
        }
        const value = formatPrice(item.value)
        return { ...item, url, title, value }
      })

      console.log(data)
      setPurses(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      getValidationErrors(error)
    }
  }
  return (
    <Container loading={loading ? Boolean(loading) : undefined}>
      <Main>
        <Itens>
          {purses.map(item => (
            <Link key={item.id} to={item.url}>
              <div>
                <strong>
                  Credito de {item.value} {item.title}
                </strong>
                <p>{item.description}</p>
              </div>
              {item.appointment_id && <FiChevronRight size={20} />}
            </Link>
          ))}
        </Itens>
      </Main>
    </Container>
  )
}

export default Purse
