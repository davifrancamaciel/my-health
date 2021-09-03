import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Form, Input } from '@rocketseat/unform';

import {
  signInRequest,
  changePasswordRequest,
  signFailure
} from 'store/modules/auth/actions';
import SubmitButton from 'components/SubmitButton';
import {
  Content,
  BackgroundSignIn,
  AnimationContainerLeft
} from '../_layouts/auth/styles';
import useQuery from 'hooks/queryString';
import showToast from 'Utils/showToast';
import getValidationErrors from 'Utils/getValidationErrors';
import api from 'services/api';

import logo from 'assets/logo.png';
import validation from './validation';

const SignIn = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = query.get('token');

    async function validateAccount() {
      try {
        dispatch(changePasswordRequest());
        const response = await api.put('register', { token });
        const { email, message } = response.data;
        setUser({ email });
        showToast.success(message);
        dispatch(signFailure());
      } catch (error) {
        getValidationErrors(error);
        dispatch(signFailure());
      }
    }
    token && validateAccount();
    dispatch(signFailure());
  }, []);

  function handleSubmit({ email, password }) {
    dispatch(signInRequest(email, password));
  }

  return (
    <>
      <Content>
        <AnimationContainerLeft>
          <img src={logo} alt="UPIS Saúde" />
          <Form
            initialData={user}
            schema={validation()}
            onSubmit={handleSubmit}
          >
            <Input name="email" type="email" placeholder="Seu e-mail" />
            <Input name="password" type="password" placeholder="Sua senha" />
            <SubmitButton loading={loading} text={'Acessar'} />
            <Link to="/register">Criar conta </Link>
            <Link to="/forgot">Esqueci minha senha</Link>
          </Form>
        </AnimationContainerLeft>
      </Content>
      <BackgroundSignIn />
    </>
  );
};

export default SignIn;
