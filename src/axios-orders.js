import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-burger-intuify.firebaseio.com/'
});

export default instance;