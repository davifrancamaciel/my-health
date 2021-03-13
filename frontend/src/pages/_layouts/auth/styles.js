import styled, { keyframes } from 'styled-components';
import { darken, lighten } from 'polished';
import { PRIMARY_COLOR } from '../../../constants/colors';
import bgIn from '../../../assets/bg_doctors.svg';
import bgUp from '../../../assets/bg_medicine.svg';
import bgForgot from '../../../assets/bg_forgot_password.svg';
import bgReset from '../../../assets/bg_my_password.svg';

export const Wrapper = styled.div`
	min-height: 100%;
	height: 100vh;
	background: linear-gradient(-90deg, ${darken(0.15, `${PRIMARY_COLOR}`)}, ${PRIMARY_COLOR});
	display: flex;
	justify-content: center;
	align-items: stretch;
`;

export const Content = styled.div`
	width: 100%;
	max-width: 600px;
	text-align: center;
	place-content: center;
	display: flex;
	flex-direction: column;
	align-items: center;

	img {
		max-width: 275px;
	}
	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		place-content: center;

		margin: 30px auto;
		width: 340px;
		max-width: 340px;

		input {
			background: rgba(0, 0, 0, 0.1);
			border: 0;
			border-radius: 4px;
			height: 44px;
			padding: 0 15px;
			color: #fff;
			margin: 0 0 10px;
			width: 100%;
			&::placeholder {
				color: rgba(255, 255, 255, 0.7);
			}
		}

		span {
			color: var(--secondary-color);
			align-self: flex-start;
			margin: 0 0 10px;
			font-weight: bold;
		}

		a {
			color: #fff;
			margin-top: 15px;
			font-size: 16px;
			opacity: 0.8;
			&:hover {
				opacity: 1;
			}
		}
	}
`;

const appearFromRight = keyframes`
  from{
    opacity:0;
    transform:translateX(50px);
  }
  to{
    opacity:1;
    transform:translateX(0)
  }
`;

export const AnimationContainerRight = styled.div`
	animation: ${appearFromRight} 1s;
`;

const appearFromLeft = keyframes`
  from{
    opacity:0;
    transform:translateX(-50px);
  }
  to{
    opacity:1;
    transform:translateX(0)
  }
`;

export const AnimationContainerLeft = styled.div`
	animation: ${appearFromLeft} 1s;
`;

export const BackgroundSignUp = styled.div`
	flex: 1;
	/* background: #f8f8f5 url(${bgUp}) no-repeat 40% top; */
	/* background-size: cover; */
	background: #f8f8f5 url(${bgUp}) no-repeat center;
	background-size: 450px;
`;

export const BackgroundSignIn = styled.div`
	flex: 1;
	/* background: url(${bgIn}) no-repeat center;
	background-size: cover; */
	background: #f8f8f5 url(${bgIn}) no-repeat center;
	background-size: 450px;
`;

export const BackgroundForgot = styled.div`
	flex: 1;
	background: #f8f8f5 url(${bgForgot}) no-repeat center;
	background-size: 450px;
`;

export const BackgroundReset = styled.div`
	flex: 1;
	background: #f8f8f5 url(${bgReset}) no-repeat center;
	background-size: 450px;
`;
