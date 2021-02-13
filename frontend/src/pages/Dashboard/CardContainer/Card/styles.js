import styled, { keyframes, css } from 'styled-components'
import { SECONDARY_COLOR } from '../../../../constants/colors'

const rotate = keyframes`
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}`

export const Container = styled.div`
  background: ${({ total }) => (total ? `${SECONDARY_COLOR}` : '#fff')};
  padding: 22px 32px;
  border-radius: 2px;
  color: ${({ total }) => (total ? '#fff' : '#363F5F')};
  height: 154px;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      font-size: 16px;
    }
  }

  h2 {
    color: ${({ total }) => (total ? '#fff' : 'var(--secondary-color)')};
    margin-top: 14px;
    font-size: 36px;
    font-weight: normal;
    line-height: 54px;
    ${props =>
      props &&
      props.loading &&
      css`
        svg {
          font-weight: bold;
          animation: ${rotate} 2s linear infinite;
        }
      `}
  }
`
