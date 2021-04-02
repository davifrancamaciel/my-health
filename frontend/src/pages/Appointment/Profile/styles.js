import styled from 'styled-components';
import { PRIMARY_COLOR } from 'constants/colors';

export const Container = styled.div`
	display: flex;
	background-color: #fff;
	box-shadow: 0 0 14px 0 #00000033;
	border-radius: 2px;
	flex-direction: column;
	min-width: 300px;
	max-width: 400px;
	align-items: center;
	height: 100%;
	padding: 40px 20px;
	margin-top: 118px;
	margin: 50px auto;
	@media (max-width: 780px) {
		margin-top: 0px;
	}

	> img {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		object-fit: cover;
		border: solid 4px ${PRIMARY_COLOR};
	}
`;

export const ProfileInfo = styled.div`
	width: 100%;
	margin-top: 40px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	color: #666;

	> strong {
		text-align: center;
		a {
			color: #666;
			font-size: 14px;
			text-decoration: none;
			cursor: pointer;
		}
	}
	> strong + strong {
		margin-top: 15px;
	}
	> div {
		display: flex;
		justify-content: space-between;

		p {
			font-size: 14px;
			margin-top: 2px;
			line-height: 20px;
			margin: 10px 0;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			a {
				color: #666;
				font-size: 14px;
				text-decoration: none;
				cursor: pointer;
			}

			svg {
				margin-right: 5px;
			}
		}
	}
	> p {
		font-size: 14px;
		margin-top: 2px;
		line-height: 20px;
		margin: 10px 0;
	}
`;
