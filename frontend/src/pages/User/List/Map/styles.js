import styled from 'styled-components';

export const MapContainer = styled.div`
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
