import React from 'react';
import { FiLogIn, FiUser } from 'react-icons/fi'
import { AiFillMedicineBox } from 'react-icons/ai'
import { Link } from 'react-router-dom'

import logo from 'assets/logoupish.png';

import { Page, Container, Content, Buttons } from './styles';


const Home = () => {

    const Buttom = ({ path, title, icon }) => {
        return (
            <Link to={`/${path}`}>
                <span>
                    {icon}
                </span>
                <strong>{title}</strong>
            </Link>
        )
    }

    return (
        <Page>
            <Container>
                <Content>
                    <header>
                        <img src={logo} alt='UPIS Saúde' />
                    </header>
                    <main>
                        <h1>Sua plataforma digital para contratar e agendar consultas, exames e procedimentos.</h1>
                        <p>
                            A plataforma UPIS SAÚDE foi criada para levar o seu atendimento no seu bolso, facilitando a busca de profissionais de saúde, com uma forma atual e prática de contratar e agendar consultas, exames e procedimentos.
                        </p>
                        <Buttons>
                            <Buttom title={'Acessar minha conta'} path={'login'} icon={<FiLogIn />} />
                            <Buttom title={'Criar conta como paciente'} path={'register'} icon={<FiUser />} />
                            <Buttom title={'Criar conta como pestador de serviços'} path={'register-provider'} icon={<AiFillMedicineBox />} />
                        </Buttons>
                    </main>
                </Content>
            </Container>
        </Page>
    )
}

export default Home;