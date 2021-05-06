import styled, { keyframes } from 'styled-components';
import { darken } from 'polished';
import { PRIMARY_COLOR } from 'constants/colors';
import bgIn from 'assets/bg_doctors.svg';
import bgUp from 'assets/bg_medicine.svg';
import bgForgot from 'assets/bg_forgot_password.svg';
import bgReset from 'assets/bg_my_password.svg';

export const Wrapper = styled.div`
	min-height: 100vh;
	height: 100%;
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
		margin-top: 20px;
		max-width: 275px;
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		place-content: center;
		margin: 30px auto;
		width: 100%;
		max-width: 340px;

		.field-group {
			flex: 1;
			display: flex;
		}

		.field {
			flex: 1;
			display: flex;
			flex-direction: column;
		}
		.field-group .field + .field {
			margin-left: 24px;
		}
		select,
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
		select option {
			background: #333;
			color: #fff;
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
		.dfm-i-accept-term {
			display: grid;

			label {
				span {
					margin: auto 0;
				}
			}
			a {
				margin-top: 0;
			}
		}
	}
	@media (max-width: 600px) {
		padding: 15px;
		img {
			width: 100%;
		}

		form .field-group {
			width: 100%;
			display: block;
		}
		form .field-group .field + .field {
			margin-left: 0px;
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
	width: 100%;
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
	width: 100%;
	animation: ${appearFromLeft} 1s;
`;

export const BackgroundSignUp = styled.div`
	flex: 1;
	background: #f8f8f5 url(${bgUp}) no-repeat center;
	background-size: 450px;
`;

export const BackgroundSignIn = styled.div`
	flex: 1;
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
