import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { parseISO, format } from 'date-fns'
import pt from 'date-fns/locale/pt'

import Container from 'components/_layouts/Container'
import ShowConfirm from 'components/ShowConfirm'
import NoData from 'components/NoData'
import LoadMore from 'components/LoadMore'
import Order from 'components/Order'

import ListItem from './ListItem'
import Search from './Search'

import api from 'services/api'
import history from 'services/browserhistory'
import getValidationErrors from 'Utils/getValidationErrors'
import showToast from 'Utils/showToast'
import { formatPrice } from 'Utils/formatPrice'

import { Main, Ul } from 'components/_layouts/ListContainer/styles'

const orderByOptions = [
  { value: 'description', label: 'Descrição' },
  { value: 'value', label: 'Valor' }
]

const CreditList = function () {
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState()
  const [noData, setNoData] = useState(false)
  const [credits, setCredits] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [onChangeOrder, setOnChangeOrder] = useState()

  useEffect(() => {
    async function loadCredits () {
      try {
        setLoading(true)

        const response = await api.get('credits', {
          params: { ...search, page, ...onChangeOrder }
        })

        const data = response.data.rows.map(credit => {
          return {
            ...credit,
            valueFormatted: formatPrice(credit.value),
            createdAtFormatedDate: `Cadastrado no dia ${format(
              parseISO(credit.createdAt),
              "d 'de' MMMM",
              {
                locale: pt
              }
            )}`
          }
        })

        if (page > 1) setCredits([...credits, ...data])
        else setCredits(data)

        setTotal(response.data.count)
        setNoData(data.length == 0)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        getValidationErrors(error)
      }
    }

    loadCredits()
  }, [search, page, onChangeOrder])

  async function handleDelete (item) {
    ShowConfirm(
      'Atenção',
      `Confirma a remoção do credito de  ${item.user.name} no valor de ${item.valueFormatted}?`,
      () => handleDeleteConfirm(item.id)
    )
  }

  async function handleDeleteConfirm (id) {
    try {
      setLoading(true)
      await api.delete(`credits/${id}`)

      showToast.success('Crédito excluído com sucesso!')
      const updateCredits = credits.filter(c => c.id !== id)
      setTotal(total - 1)
      setCredits(updateCredits)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      getValidationErrors(error)
    }
  }

  function handleUpdate (id) {
    history.push(`/credit/edit/${id}`)
  }

  return (
    <Container
      title='Créditos dos usuários'
      loading={loading ? Boolean(loading) : undefined}
      showBack
    >
      <Search onSearch={setSearch} setPage={setPage} />
      <span>
        <span>{total > 0 && <span>Total {total}</span>}</span>
        <Link to='/credit/create'>
          <FiPlus size={20} /> Cadastrar
        </Link>
      </span>
      <Order
        onChangeOrder={setOnChangeOrder}
        orderOptions={orderByOptions}
        setPage={setPage}
      />
      {noData && <NoData text={`Não há dados para exibir :(`} />}
      <Main>
        <Ul>
          {credits.map(credit => (
            <ListItem
              item={credit}
              key={credit.id}
              onUpdateClick={handleUpdate}
              onDeleteClick={handleDelete}
            />
          ))}
        </Ul>
      </Main>

      <LoadMore
        onClick={() => setPage(page + 1)}
        total={total}
        loadedItens={credits.length}
      />
    </Container>
  )
}

export default CreditList
