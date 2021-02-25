export default function url(number, message) {
	    
    const numberPattern = /\d+/g;
	number = number.match(numberPattern);
    number = number.map((x) => x).join('');
    
	const text = message ? `&text=${message}` : '';
	return `https://api.whatsapp.com/send?phone=+55${number}${text}`;
}
