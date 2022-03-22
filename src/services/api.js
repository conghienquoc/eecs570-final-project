import http from '../utils/http-common';

class API {
    async getInitialState(paramObj) {
        console.log(paramObj);

        const response = await http.get('/getInitialState', {
            params: paramObj,
        });
        return response.data;
    }
}

export default new API()