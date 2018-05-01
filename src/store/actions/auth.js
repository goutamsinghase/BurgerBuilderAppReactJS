import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId ) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = ( error ) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('expirattionDate');
	localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

export const checkAuthTimeOut = (expirationTime) => {
	return dispatch => {
		setTimeout(()=>{
			dispatch(logout());
		}, expirationTime*1000);
	};
};

export const auth = (email, password, isSignUp) => {
	return dispatch =>{
		dispatch(authStart());
		const authData = {
			email: email, 
			password: password, 
			returnSecureToken: true
		};
		const API_KEY = 'AIzaSyDlntId4Q8SXrUjyiVcTET5_C-fJ3Z_DcQ'
        let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${API_KEY}`;
        if(!isSignUp){
        	url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${API_KEY}`
        }
		axios.post(url, authData)
			.then(response=>{
				console.log(response.data);
				const expirattionDate = new Date(new Date().getTime() + response.data.expiresIn*1000);
				localStorage.setItem('token', response.data.idToken);
				localStorage.setItem('expirattionDate', expirattionDate);
				localStorage.setItem('userId', response.data.localId);
				dispatch(authSuccess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeOut(response.data.expiresIn));
			})
			.catch(error=>{
				dispatch(authFail(error.response.data.error));
			})
	};
};

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	}
};

export const authCheckState = (expirationTime) => {
	return dispatch => {
		const token = localStorage.getItem('token'),
		userId = localStorage.getItem('userId');
		if(!token){
			dispatch(logout());
		}else{
			const expirattionDate = new Date(localStorage.getItem('expirattionDate'));

			if(expirattionDate <= new Date()){
				dispatch(logout());
			}else{
				dispatch(authSuccess(token, userId));
				dispatch(checkAuthTimeOut((expirattionDate.getTime() - new Date().getTime())/1000));
			}
		}
	};
};