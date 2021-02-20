import styled from 'styled-components'

export const ContainerSpecialtyVehicle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 750px) {
    flex-direction: column;
  }
`
