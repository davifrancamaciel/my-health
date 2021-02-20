import styled from 'styled-components'
import { darken, lighten } from 'polished';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../constants/colors';

export const HeaderContainer = styled.section`
  background: linear-gradient(-90deg, ${darken(0.15, `${PRIMARY_COLOR}`)}, ${PRIMARY_COLOR});
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
  .specialty-graph {
    height: 350px;

    h3 {
      color:${SECONDARY_COLOR};
      margin-bottom: 20px;
    }
  }
`
