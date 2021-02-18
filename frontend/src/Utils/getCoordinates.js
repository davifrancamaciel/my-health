import axios from 'axios';

export default async function getCoordinates(adress) {
	try {
		if (!adress) return null;

		adress = encodeURI(adress);

		if (adress.length < 8) return;

		const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${adress}&key=${'AIzaSyBD4W9PLx3dU3eDvRpK3hYATGPSM-Jtff8'}`;

		const response = await axios.get(url);

		const { results } = response;

		return {
			response,
		};
	} catch (error) {
		return null;
	}
}
