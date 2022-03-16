import React from 'react';

import { all, takeLatest, call, put } from 'redux-saga/effects';

import history from 'services/browserhistory';
import {
  AUTH_SIGN_IN_REQUEST,
  AUTH_SIGN_UP_REQUEST,
  AUTH_SIGN_OUT
} from 'constants/auth';
import { signInSuccess, signFailure, signUpSuccess } from './actions';
import api from 'services/api';
import showToast from 'Utils/showToast';
import getValidationErrors from 'Utils/getValidationErrors';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, '/sessions', {
      email,
      password
    });

    const { token, user } = response.data;

    api.defaults.headers['Authorization'] = `Bearer ${token}`;

    yield put(signInSuccess(token, user));

    if (!user.cpf_cnpj || !user.rg) {
      history.push('/profile?register=incomplete');
      return;
    }

    const returnUrl = localStorage.getItem('@UpisSaudeReturnUrl');
    if (returnUrl) {
      history.push(returnUrl);
      localStorage.setItem('@UpisSaudeReturnUrl', ``);
    } else {
      history.push('/dashboard');
    }
  } catch (error) {
    getValidationErrors(error);
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const response = yield call(api.post, 'register', payload);

    history.push('/');
    const { message } = response.data;
    showToast.success(message);
    yield put(signUpSuccess());
  } catch (error) {
    getValidationErrors(error);
    yield put(signFailure());
  }
}

function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
}

function signOut() {
  history.push('/');
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest(AUTH_SIGN_IN_REQUEST, signIn),
  takeLatest(AUTH_SIGN_UP_REQUEST, signUp),
  takeLatest(AUTH_SIGN_OUT, signOut)
]);
