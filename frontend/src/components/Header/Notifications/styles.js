import styled, { css } from 'styled-components';
import { lighten } from 'polished';
// import PerfectScrollbar from 'react-perfect-scrollbar';
import { PRIMARY_COLOR } from 'constants/colors';

export const Container = styled.div`
	position: relative;
`;
export const Badge = styled.button`
	background: none;
	border: 0;
	position: relative;
	${(props) =>
		props.hasUnread &&
		css`
			&::after {
				position: absolute;
				right: 0;
				top: 0;
				width: 8px;
				height: 8px;
				background: var(--warning-color);
				content: '';
				border-radius: 50px;
			}
		`}
`;
export const NotificationList = styled.div`
	position: absolute;
	width: 260px;
	left: calc(50% - 130px);
	top: calc(100% + 30px);
	background: rgba(0, 0, 0, 0.6);
	border-radius: 4px;
	padding: 15px 5px;
	display: ${(props) => (props.visible ? 'block' : 'none')};
	z-index: 10;

	&::before {
		content: '';
		position: absolute;
		left: calc(50% - 20px);
		top: -20px;
		width: 0;
		height: 0;
		border-left: 20px solid transparent;
		border-right: 20px solid transparent;
		border-bottom: 20px solid rgba(0, 0, 0, 0.8);
	}
`;
export const Notification = styled.div`
	color: #fff;

	& + div {
		margin-top: 15px;
		padding-top: 15px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	p {
		font-size: 13px;
		line-height: 18px;
		cursor: pointer;
	}

	time {
		font-size: 12px;
		opacity: 0.6;
		display: block;
		margin-bottom: 5px;
	}

	button {
		font-size: 12px;
		border: 0;
		background: none;
		color: ${lighten(0.2, PRIMARY_COLOR)};
		// padding: 0 5px;
		// matgin: 0 5px;
		// border-left: 1px solid rgba(0, 0, 0, 0.1);
	}

	${(props) =>
		props.unread &&
		css`
			&::after {
				content: '';
				display: inline-block;
				width: 8px;
				height: 8px;
				background: #ff892e;
				border-radius: 50%;
				margin-left: 10px;
			}
		`}
`;
// export const Scroll = styled(PerfectScrollbar)`
export const Scroll = styled.div`
	max-height: 260px;
	padding: 5px 15px;
	overflow-y: scroll;

	&::-webkit-scrollbar {
		width: 10px;
	}

	/* Track */
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 10px;
	}

	/* Handle */
	&::-webkit-scrollbar-thumb {
		background: #888;
		border-radius: 11px;
	}

	/* Handle on hover */
	&::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`;
