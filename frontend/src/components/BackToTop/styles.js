import styled from 'styled-components'

export const Container = styled.div`
  background: var(--primary-color);
  color: #fff;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  padding: 0.5rem;
  clip-path: circle();
  font-size: 1.5rem;
  line-height: 0;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s;
  transform: translateY(100%);
  cursor: pointer;

  &.show {
    visibility: visible;
    opacity: 1;
    transform: translateY(0%);
  }
`
