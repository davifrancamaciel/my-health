import styled, { css } from 'styled-components'

export const Itens = styled.div`
  a {
    background: #fff;
    border-radius: 5px;
    width: 100%;
    padding: 24px;
    display: block;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: transform 0.2s;
    & + a {
      margin-top: 16px;
    }
    &:hover {
      transform: translateX(28px);
    }
    div {
      margin: 0 16px;
      flex: 1;
      strong {
        font-size: 20px;
        color: var(--primary-color);
        &.used {
          color: var(--danger-color);
        }
        &.inactive {
          color: var(--warning-color);
        }
      }
      p {
        font-size: 18px;
        color: #a8a8b3;
        margin-top: 4px;
      }
    }
    svg {
      margin-left: auto;
      color: #a8a8b3;
    }
  }
`
