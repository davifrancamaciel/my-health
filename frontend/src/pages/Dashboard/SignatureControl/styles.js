import styled from 'styled-components'

export const InfoDays = styled.span`
  color: ${({ expireWarning }) => (expireWarning ? '#002c82' : '#fff')};
`
