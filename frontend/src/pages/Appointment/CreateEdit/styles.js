import styled from 'styled-components';
import { PRIMARY_COLOR } from 'constants/colors';

export const SheduleContainer = styled.div`
	display: flex;
	justify-content: space-between;
	@media (max-width: 780px) {
		flex-direction: column;
	}
`;

export const Profile = styled.div`
	display: flex;
	background-color: #fff;
	border: solid 2px ${PRIMARY_COLOR};
	box-shadow: 0 0 14px 0 #00000033;
	border-radius: 2px;
	flex-direction: column;
	min-width: 300px;
	max-width: 400px;
	align-items: center;
	height: 100%;
	padding: 40px 20px;
	margin-top: 118px;
  margin:  50px auto ;

	> img {
		width: 200px;
		height: 200px;
		border-radius: 50%;
		object-fit: cover;
		border: solid 4px ${PRIMARY_COLOR};
	}
`;

export const ProfileInfo = styled.div`
	margin-top: 40px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	color: #666;

	> strong {
		text-align: center;
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

			span {
				display: flex;
				svg {
					margin-right: 5px;
				}
			}
		}
	}
`;

export const Shedule = styled.div`
	max-width: 600px;
	margin: 50px auto;
	display: flex;
	flex: 1;
	flex-direction: column;
	padding: 0px 20px;

	header {
		display: flex;
		align-self: center;
		align-items: center;

		button {
			border: 0;
			background: none;
		}

		strong {
			color: ${PRIMARY_COLOR};
			font-size: 24px;
			margin: 0 15px;
		}
	}
	ul {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 15px;
		margin-top: 30px;
	}
`;

export const Time = styled.li`
	cursor: pointer;
	padding: 20px;
	border-radius: 2px;
	background: #fff;
	box-shadow: 0 0 14px 0 #00000033;

	opacity: ${(props) => (props.past ? 0.6 : 1)};

	strong {
		display: block;
		color: ${(props) => (props.available ? '#999' : `${PRIMARY_COLOR}`)};
		font-size: 20px;
		font-weight: normal;
	}
	span {
		display: block;
		margin-top: 3px;
		color: ${(props) => (props.available ? '#999' : '#666')};
	}
`;
