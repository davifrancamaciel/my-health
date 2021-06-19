import styled from 'styled-components';
import { PRIMARY_COLOR } from 'constants/colors';

export const ContainerMapSelectProvider = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: space-between;
	@media (max-width: 720px) {
		padding-top: 30px;
		flex-direction: column;
	}
`;

export const Search = styled.div`
	margin-top: 100px;
	display: flex;
	flex-direction: column;
	padding: 0px 20px;
	min-width: 300px;
	max-width: 350px;
	> h1 {
		color: var(--secondary-color);
		margin-bottom: 30px;
	}

	.input-search,
	.react-select__control {
		margin-top: 15px !important;
	}

	input,
	input::placeholder {
		color: ${PRIMARY_COLOR} !important;
	}

	form > span {
		color: var(--secondary-color);
		align-self: flex-start;
		margin: 0 0 10px;
		font-weight: bold;
	}
	@media (max-width: 720px) {
		margin-top: 50px;
		max-width: 100%;
	}
`;

export const Location = styled.div`
	text-align: center;
	label {
		color: ${PRIMARY_COLOR} !important;
	}
`;

export const Map = styled.div`
	flex: 1;
	@media (max-width: 720px) {
		padding: 0px 20px;
	}
	> .leaflet-container {
		width: 100%;
		height: 100vh;
		z-index: 0;
		.leaflet-popup {
			left: -138px !important;
		}
	}
`;
