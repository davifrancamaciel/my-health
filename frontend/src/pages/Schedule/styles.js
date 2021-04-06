import styled, { css } from 'styled-components';
import { PRIMARY_COLOR } from 'constants/colors';

export const SheduleContainer = styled.div`
	max-width: 800px;
	margin: 50px auto;
	display: flex;
	flex-direction: column;

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
		@media (max-width: 780px) {
			grid-template-columns: 1fr;
		}
	}
`;

export const Time = styled.li`
	position: relative;
	padding: 20px;
	border-radius: 2px;
	background: #fff;
	box-shadow: 0 0 14px 0 #00000033;
	display: flex;
	justify-content: space-between;
	opacity: ${(props) => (props.past ? 0.6 : 1)};

	div {
		${(props) =>
			props.isAppointment &&
			css`
				cursor: pointer;
			`}
		strong {
			display: block;
			color: ${(props) =>
				props.available
					? '#999'
					: `${props.scheduledWithUser === 'Médico' && props.provider ? '#ff892e' : PRIMARY_COLOR}`};

			font-size: 20px;
			font-weight: normal;
		}
		span {
			display: block;
			margin-top: 3px;
			color: ${(props) => (props.available ? '#999' : '#666')};
		}
	}

	img {
		${(props) =>
			props.isAppointment &&
			css`
				cursor: pointer;
			`}
		width: 60px;
		height: 60px;
		margin-left: 5px;
		border-radius: 50%;
		object-fit: cover;
		border: solid 4px
			${(props) => (props.scheduledWithUser === 'Médico' && props.provider ? '#ff892e' : PRIMARY_COLOR)};
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
