import styled, { css } from 'styled-components';

export const Container = styled.div`
	display: none;
	${(props) =>
		props.loading &&
		css`
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 999;
			background: rgba(255, 255, 255, 0.5);
			left: 0;
			display: flex;
			flex-direction: row;
			justify-content: center;
			min-height: 100%;
			align-items: center;

			> svg {
				color: var(--secondary-color);
				font-weight: bold;
			}
		`}
`;
