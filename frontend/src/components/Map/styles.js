import styled from 'styled-components';

export const Container = styled.div`
	width: 100%;
	height: 400px;

	> .leaflet-container {
		width: 100%;
		height: 400px;
		.leaflet-popup {
			left: -49px !important;
		}
	}
`;
