import styled, { css } from 'styled-components';

export const Container = styled.div`
	width: 100%;
	max-width: ${(props) => (props.full ? '100%' : '1120px')};
	${(props) =>
		!props.full &&
		css`
			padding: 40px 20px;
		`}
	margin: 0 auto;

	> div > span.dfm-back-page,
	> span {
		display: flex;
		flex-direction: row;
		text-align: center;
		justify-content: space-between;
		color: var(--text-color);
		font-weight: bold;

		> span {
		}

		> a {
			color: var(--text-color);
			margin-bottom: 15px;
			font-size: 16px;
			justify-content: end;
			display: flex;
			opacity: 1;
			align-items: center;

			> svg {
				color: var(--secondary-color);
				margin-right: 10px;
			}
			&:hover {
				opacity: 0.8;
			}
		}
	}
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30px;

	> h1 {
		color: var(--secondary-color);
	}
`;
