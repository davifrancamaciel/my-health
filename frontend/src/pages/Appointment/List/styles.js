import styled from 'styled-components';

export const ContainerMapSelectProvider = styled.div`
	width: 100%;
	height: 100vh;
	position: relative;
	display: flex;
	justify-content: center;

	> .leaflet-container {
		width: 100%;
		height: 100vh;
		z-index: 0;
		.leaflet-popup {
			left: -138px !important;
		}
	}
`;
export const Search = styled.div`
	position: absolute;
	top: 10px;
	z-index: 1;
	width: 80%;
	margin: auto 0px;
`;
