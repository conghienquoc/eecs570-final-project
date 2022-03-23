import axios from 'axios';

const http = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_ANGEL_URL,
    headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": '*'
    }
});


export default http;