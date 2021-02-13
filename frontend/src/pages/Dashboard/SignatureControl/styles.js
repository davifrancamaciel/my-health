import styled from 'styled-components'
import { SECONDARY_COLOR } from '../../../constants/colors';

export const InfoDays = styled.span`
  color: ${({ expireWarning }) => (expireWarning ? `${SECONDARY_COLOR}` : '#fff')};
`
