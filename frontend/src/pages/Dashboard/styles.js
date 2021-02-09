import styled from 'styled-components'
import { darken, lighten } from 'polished';

export const HeaderContainer = styled.section`
  background: linear-gradient(-90deg, ${darken(0.15, '#93D408')}, #93d408);
  height: 250px;
  > div {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: 40px 20px;

    > span {
      display: flex;
      justify-content: space-between;
      > h1 {
        color: var(--secondary-color);
      }      
    }

    > h2 {
      color: #fff;
      margin-top: 20px;
    }
  }
`
export const DashboardContainer = styled.section`
  margin-top: -120px;
  .expense-graph {
    height: 350px;

    h3 {
      color: #002c82;
      margin-bottom: 20px;
    }
  }
`
