import axios from 'axios';

// const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY
const API_KEY = 'AIzaSyBD4W9PLx3dU3eDvRpK3hYATGPSM-Jtff8';

export async function getCoordinates(adress) {
	try {
		if (!adress) return null;

		adress = encodeURI(adress);

		if (adress.length < 8) return;

		const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${adress}&key=${API_KEY}`;

		const response = await axios.get(url);

		const { data } = response;

		return {
			location: { ...data.results[0].geometry.location },
		};
	} catch (error) {
		return null;
	}
}

export async function getLocaleByCoordinates(latitude, longitude) {
	try {
		if (!latitude || !longitude) return null;

		const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;

		const response = await axios.get(url);

		const { data } = response;

		return {
			data: data.results[0].geometry,
		};
	} catch (error) {
		return null;
	}
}
