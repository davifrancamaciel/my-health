import styled from 'styled-components';
import { PRIMARY_COLOR } from 'constants/colors';

export const SheduleContainer = styled.div`
	display: flex;
	justify-content: space-between;
	@media (max-width: 780px) {
		flex-direction: column;
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
	position: relative;
	cursor: pointer;
	border-radius: 2px;
	background: #fff;
	box-shadow: 0 0 14px 0 #00000033;

	opacity: ${(props) => (props.available ? 0.6 : 1)};
	div {
		padding: 20px;

		strong {
			text-align: center;
			display: block;
			color: ${(props) => (props.available ? '#999' : `${PRIMARY_COLOR}`)};
			font-size: 20px;
			font-weight: normal;
		}
	}
	button {
		border: 0;
		background: none;
		margin-left: 5px;
		padding: 5px;
		height: 30px;
		position: absolute;
		top: 3px;
		right: 3px;
	}
`;
