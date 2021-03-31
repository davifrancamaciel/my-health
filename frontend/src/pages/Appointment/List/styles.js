import styled from 'styled-components';

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
	/* margin: auto 0px; */
	place-content: center;
    display: flex;
    flex-direction: column;
	padding: 0px 20px;
	min-width: 300px;
	max-width: 350px;
	> h1 {
		color: var(--secondary-color);
		margin-bottom: 30px;
	}
	@media (max-width: 720px) {
		max-width: 100%;
	}
`;

export const Location = styled.div`
	text-align: center;
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
