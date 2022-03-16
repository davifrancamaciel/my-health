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

  .content {
    width: 100%;
    height: 100%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 30px;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .content header {
    margin: 48px 0 0;
  }

  .content header img {
    max-width: 200px;
  }

  .content main {
    flex: 1;
    /* max-width: 560px; */

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .content main h1 {
    font-size: 44px;
    color: var(--title-color);
  }

  .content main p {
    font-size: 24px;
    margin-top: 24px;
    line-height: 38px;
  }

  .content main a {
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

  .content main a span {
    display: block;
    background: rgba(0, 0, 0, 0.08);
    width: 72px;
    height: 72px;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .content main a span svg {
    color: #fff;
    width: 20px;
    height: 20px;
  }

  .content main a strong {
    flex: 1;
    text-align: center;
    color: #fff;
  }

  .content main a:hover {
    background: #2fb86e;
  }

  @media (max-width: 900px) {
    .content {
      align-items: center;
      text-align: center;
    }

    .content header {
      margin: 48px auto 0;
    }

    .content main {
      align-items: center;
    }

    .content main h1 {
      font-size: 42px;
    }

    .content main p {
      font-size: 24px;
    }
  }
`;

export const Buttons = styled.div`

  grid-gap: 15px;
  margin-top: 80px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 32px;
  @media (max-width: 780px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 530px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
