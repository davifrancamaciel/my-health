import React from 'react';
import { FiLogIn, FiUser } from 'react-icons/fi'
import { AiFillMedicineBox } from 'react-icons/ai'
import { Link } from 'react-router-dom'

import logo from 'assets/logoupish.png';

import { Page, Container, Buttons } from './styles';

function Home() {
    return (
        <Page>
            <Container>
                <div className='content'>
                    <header>
                        <img src={logo} alt='UPIS Saúde' />
                    </header>
                    <main>
                        <h1>Sua plataforma digital para contratar e agendar consultas, exames e procedimentos.</h1>
                        <p>
                            A plataforma UPIS SAÚDE foi criada para levar o seu atendimento no seu bolso, facilitando a busca de profissionais de saúde, com uma forma atual e prática de contratar e agendar consultas, exames e procedimentos.
                        </p>
                        <Buttons>

                            <Link to={'/login'}>
                                <span>
                                    <FiLogIn />
                                </span>
                                <strong>Acessar minha conta</strong>
                            </Link>
                            <Link to={'/register'}>
                                <span>
                                    <FiUser />
                                </span>
                                <strong>Criar conta como paciente</strong>
                            </Link>
                            <Link to={'/register-provider'}>
                                <span>
                                    <AiFillMedicineBox />
                                </span>
                                <strong>Criar conta como pestador de serviços</strong>
                            </Link>
                        </Buttons>
                    </main>
                </div>
            </Container>
        </Page>
    )
}

export default Home;