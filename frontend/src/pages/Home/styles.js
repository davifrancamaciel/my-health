import styled from 'styled-components';
import bgUp from 'assets/bg_medicine.svg';

export const Page = styled.div`
  background: #fff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Container = styled.div`
  height: 100vh;
  max-width: 1200px;
  background: #fff url(${bgUp}) no-repeat right;
  background-size: 450px;
  color: var(--text-color); 
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 30px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  header {
    margin: 48px 0 0;
  }

  header img {
    max-width: 200px;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  main h1 {
    font-size: 44px;
    color: var(--title-color);
  }

  main p {
    font-size: 24px;
    margin-top: 24px;
    line-height: 38px;
  }

   main a {
    width: 100%;
    max-width: 360px;
    height: 72px;
    background: var(--primary-color);
    border-radius: 8px;
    text-decoration: none;

    display: flex;
    align-items: center;
    overflow: hidden;

    margin-top: 40px;
  }

   main a span {
    display: block;
    background: rgba(0, 0, 0, 0.08);
    width: 72px;
    height: 72px;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

   main a span svg {
    color: #fff;
    width: 20px;
    height: 20px;
  }

   main a strong {
    flex: 1;
    text-align: center;
    color: #fff;
  }

   main a:hover {
    background: #2fb86e;
  }

  @media (max-width: 900px) {     
    align-items: center;
    text-align: center;    

    header {
      margin: 48px auto 0;
    }

    main {
      align-items: center;
    }

    main h1 {
      font-size: 25px;
    }

    main p {
      font-size: 18px;
    }
  }
  @media (max-width: 550px) {     
    main {
      margin-top:25px;
    }
  }
`

export const Buttons = styled.div`

  grid-gap: 15px;
  margin-top: 80px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 32px;
  @media (max-width: 780px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
  }
  @media (max-width: 530px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
