import styled, { css } from 'styled-components';
import { darken } from 'polished';
import { SECONDARY_COLOR } from '../../constants/colors';

export const Button = styled.button`
	width: 100%;
	margin-top: 40px;
	transition: background-color 0.2s;
	cursor: pointer;
	margin: 10px 0 0;
	height: 44px;
	background: ${SECONDARY_COLOR};
	font-weight: bold;
	color: #fff;
	border: 0;
	border-radius: 4px;
	font-size: 16px;
	opacity: ${(props) => (props && props.loading ? 0.5 : 1)};
	transition: background 0.2s;
	&:hover {
		background: ${darken(0.03, `${SECONDARY_COLOR}`)};
	}

	${(props) =>
		props &&
		props.loading &&
		css`
			svg {
				color: #fff;
				font-weight: bold;
			}
		`}
`;
