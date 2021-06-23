import styled from 'styled-components';
import { lighten } from 'polished';

export const Container = styled.div`
	header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-size: 14px;
		color: var(--text-color);
		font-weight: bold;

		button {
			background: transparent;
			border: none;
			margin-bottom: 15px;
			display: flex;
			align-items: center;
            font-weight: bold;
            color: var(--text-color);
			> span {
				cursor: pointer;
				transition: color 0.2s;
				&:hover {
					color: ${lighten(0.08, '#6c6c80')};
				}
			}
			> svg {
				color: var(--secondary-color);
				margin-right: 16px;
			}
		}
	}
`;

export const PdfContainer = styled.div`
	display: flex;
	justify-content: center;
    flex-direction: column;
	overflow-x: auto;
	@media (max-width: 800px) {
		display: block;
	}
`;
