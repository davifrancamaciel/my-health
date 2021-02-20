import React from 'react'
import {
  AiOutlineShop,
  AiOutlineCar,
  AiOutlineUsergroupDelete
} from 'react-icons/ai'
import { MdAttachMoney } from 'react-icons/md'

import Card from './Card'
import { formatPrice } from '../../../Utils/formatPrice'

import { Container } from './styles'

function CardContainer ({ loaded, dashboard, company_provider }) {
  return (
    <Container>
      {company_provider && (
        <Card
          route={'company'}
          loaded={loaded}
          title={'Lojas'}
          icon={<AiOutlineShop size={26} />}
          principal_text={loaded && dashboard.companies.principal_text}
          secondary_text={loaded && dashboard.companies.secondary_text}
        />
      )}
      <Card
        route={!company_provider ? 'vehicle' : 'dashboard'}
        loaded={loaded}
        principal_text={loaded && dashboard.vehicles.principal_text}
        secondary_text={loaded && dashboard.vehicles.secondary_text}
        title={'Consultas'}
        icon={<AiOutlineCar size={26} />}
      />
      <Card
        route={!company_provider ? 'client' : 'dashboard'}
        loaded={loaded}
        principal_text={loaded && dashboard.clients.principal_text}
        secondary_text={loaded && dashboard.clients.secondary_text}
        title={'Consultas'}
        icon={<AiOutlineUsergroupDelete size={26} />}
        total={!!company_provider}
      />
      {!company_provider && (
        <Card
          route={'specialty'}
          loaded={loaded}
          principal_text={loaded && dashboard.specialties.principal_text}
          secondary_text={
            loaded && formatPrice(dashboard.specialties.secondary_text)
          }
          title={'Consultas'}
          icon={<MdAttachMoney size={26} />}
          total
        />
      )}
    </Container>
  )
}

export default CardContainer
