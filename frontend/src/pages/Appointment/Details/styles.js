import styled from 'styled-components';
import { PRIMARY_COLOR } from 'constants/colors';

export const ContainerDetail = styled.div`
	display: flex;
	flex-direction: column;
	color: #666;
	background-color: #fff;
	box-shadow: 0 0 14px 0 #00000033;
	padding: 40px 20px;
	border-radius: 2px;
	> header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 15px;
		@media (max-width: 780px) {
			flex-direction: column;
			text-align: center;
		}
		h2 {
			margin-bottom: 15px;
		}
		strong {
			color: #ff892e;
		}
	}
	> div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		@media (max-width: 780px) {
			flex-direction: column;
			text-align: center;
		}
	}
	p {
		font-size: 14px;
		margin-top: 2px;
		line-height: 20px;
		margin: 10px 0;
	}
`;

export const Appointment = styled.div`
	@media (max-width: 780px) {
		padding: 0px 20px;
	}
`;

export const Profile = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	height: 100%;
	min-width: 300px;
	/* max-width: 400px; */
	margin-top: 118px;
	margin: auto 0px;

	@media (max-width: 780px) {
		margin-top: 0px;
		flex-direction: column;
		text-align: center;
	}

	> img {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		object-fit: cover;
		border: solid 4px ${PRIMARY_COLOR};
		margin-right: 20px;
	}
`;

export const ProfileInfo = styled.div`
	width: 100%;

	display: flex;
	flex-direction: column;
	margin-right: 15px;
	margin-top: 15px;

	> strong {
		a {
			color: #666;
			font-size: 14px;
			text-decoration: none;
			cursor: pointer;
		}
	}
	> strong + strong {
		margin-top: 5px;
	}
	> div {
		display: flex;
		justify-content: center;
		p {
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
