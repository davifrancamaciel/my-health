// import React, { useState, useEffect } from 'react';
// import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

// export const MapContainer = (props) => {
// 	const [initialPosition, setInitialPosition] = useState([0, 0]);
// 	const [markers, setMarkers] = useState([]);

// 	useEffect(() => {
// 		navigator.geolocation.getCurrentPosition((postition) => {
// 			console.log(postition);
// 			const { latitude, longitude } = postition.coords;
// 			setInitialPosition([latitude, longitude]);
// 			setMarkers([
// 				{ latitude, longitude, local: 'Minha casa' },
// 				{ latitude:-22.51164510987065, longitude:-43.168373204414685, text: 'Minha casa' },
// 				{ latitude:-22.514499539552236, longitude:-43.16253685251318, text: 'Tua casa' },
// 				{ latitude:-22.5103219481959, longitude:-43.166978419398525, text: 'Casa do zoto' },
// 			]);
// 		});
// 	}, []);

// 	const displayMarkers = () => {
// 		return markers.map((store, index) => {
// 			return (
// 				<Marker
// 					key={index}
// 					id={index}
// 					position={{
// 						lat: store.latitude,
// 						lng: store.longitude,
// 					}}
// 				/>
// 			);
// 		});
// 	};

// 	return (
// 		<Map google={props.google} zoom={15} initialCenter={{ lat: -22.5072813, lng: -43.151167699999995 }}>
// 			{displayMarkers()}
// 		</Map>
// 	);
// };
// export default GoogleApiWrapper((props) => ({
// 	apiKey: 'AIzaSyA-RVeQqB14VPlQh3_QN-CRT22Ro8ThS_U',
// }))(MapContainer);
