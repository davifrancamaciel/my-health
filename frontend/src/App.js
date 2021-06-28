import React from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import './config/ReactotronConfig'

import GlobalStyle from './styles/global'

import Routes from './routes'

import history from './services/browserhistory'

import BackToTop from 'components/BackToTop'
import ScrollToTop from 'components/ScrollToTop'
import { store, persistor } from './store'

function App () {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <ScrollToTop />
          <Routes />
          <ToastContainer autoClose={10000} />
          <BackToTop />
          <GlobalStyle />
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
