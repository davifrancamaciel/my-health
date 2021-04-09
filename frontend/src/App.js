import React from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import './config/ReactotronConfig'

import Routes from './routes'

import history from './services/browserhistory'

import { store, persistor } from './store'

import GlobalStyle from './styles/global'

function App () {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <GlobalStyle />
          <Routes />
          <ToastContainer autoClose={10000} />
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
