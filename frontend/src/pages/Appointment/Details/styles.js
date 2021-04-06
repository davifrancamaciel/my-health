import styled from 'styled-components';
import { PRIMARY_COLOR } from 'constants/colors';

export const ContainerDetail = styled.div`
	display: flex;
	justify-content: space-between;
	color: #666;
	background-color: #fff;
	box-shadow: 0 0 14px 0 #00000033;
	border-radius: 2px;
	p {
		font-size: 14px;
		margin-top: 2px;
		line-height: 20px;
		margin: 10px 0;
	}
	@media (max-width: 780px) {
		flex-direction: column;
	}
`;

export const Appointment = styled.div`
	flex: 1;
	padding: 40px 20px;
	> div {
		display: flex;
		justify-content: space-between;
		strong {
			color: #ff892e;
		}
	}
	@media (max-width: 780px) {
		padding: 0px 20px;
	}
`;

export const Profile = styled.div`
	display: flex;
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
		padding: 0px 20px;
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
		justify-content: center;

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
`;
