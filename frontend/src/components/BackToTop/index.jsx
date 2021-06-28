import React, { useEffect, useState } from 'react'

import { FiArrowUp } from 'react-icons/fi'
import { Container } from './styles'

function BackToTop () {
  const [className, setClassName] = useState('')

  useEffect(() => {
    window.addEventListener('scroll', listener)
    return () => {
      window.removeEventListener('scroll', listener)
    }
  }, [])

  const listener = () => setClassName(backToTop(window.scrollY))

  const backToTop = scrollY => (scrollY >= 560 ? 'show' : '')

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <Container className={className} onClick={scrollTop}>
      <FiArrowUp />
    </Container>
  )
}

export default BackToTop
