import styled from 'styled-components';
import { darken } from 'polished';
import { PRIMARY_COLOR } from 'constants/colors';

export const Main = styled.main`
	flex: 1;
`;
export const Ul = styled.ul`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	list-style: none;

	@media (max-width: 780px) {
		grid-template-columns: 1fr;
	}
`;

export const Li = styled.li`
	background: ${(props) => (props.active == false ? '#00000000' : '#fff')};

	box-shadow: 0 0 14px 0 #00000033;
	border-radius: 2px;
	padding: 20px;

	header {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	header img {
		width: 54px;
		height: 54px;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 10px;
	}

	p {
		color: #666;
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

	a {
		color: #666;
		font-size: 14px;
		text-decoration: none;
		cursor: pointer;
	}

	a:hover {
		color: var(--secondary-color);
	}
`;
export const ResponsiveText = styled.h4`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 310px;
	color: #666;
	font-weight: 100;
	font-size: 14px;
	margin-top: 2px;
	line-height: 20px;
	margin: 10px 0;
`;
export const Info = styled.div`
	strong {
		display: block;
		font-size: 16px;
		color: #333;
	}

	span {
		font-size: 13px;
		color: #999;
		margin-top: 2px;
	}
`;

export const Actions = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-left: auto;

	button.edit {
		margin-right: 5px;
		border: 0;
		background: var(--primary-color);
		border-radius: 2px;
		padding: 5px 10px;
		font-size: 13px;
		font-weight: bold;
		color: #fff;
		cursor: pointer;
		transition: background 0.5s;
	}

	button.edit:hover {
		background: ${darken(0.2, `${PRIMARY_COLOR}`)};
	}

	button.delete {
		margin-right: 5px;
		border: 0;
		background: var(--danger-color);
		border-radius: 2px;
		padding: 5px 10px;
		font-size: 13px;
		font-weight: bold;
		color: #fff;
		cursor: pointer;
		transition: background 0.5s;
	}

	button.delete:hover {
		background: ${darken(0.2, '#f04d5a')};
	}

	@media (max-width: 720px) {
		display: block;

		button.edit {
			margin-bottom: 5px;
		}
	}
`;

export const InfoStatus = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;
export const ExpiredStatus = styled.span`
	color: ${(props) => (props.expired ? 'var(--danger-color)' : ' #666')};
`;
export const ActiveStatus = styled.span`
	color: ${(props) => (props.active ? 'var(--primary-color)' : 'var(--danger-color)')};
`;
