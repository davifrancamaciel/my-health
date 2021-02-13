import styled from 'styled-components';
import { darken, lighten } from 'polished';
import { PRIMARY_COLOR } from '../../../constants/colors';
import bgIn from '../../../assets/sign-in-background.jpg';
import bgUp from '../../../assets/sign-up-background.jpg';

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
	max-width: 700px;
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

export const BackgroundSignUp = styled.div`
	flex: 1;
	background: url(${bgUp}) no-repeat center;
	background-size: cover;
`;

export const BackgroundSignIn = styled.div`
	flex: 1;
	background: url(${bgIn}) no-repeat center;
	background-size: cover;
`;
