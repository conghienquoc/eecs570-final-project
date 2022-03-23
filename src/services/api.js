import http from '../utils/http-common';

class API {
    async getInitialState(paramObj) {
        console.log(paramObj);

        const response = await http.get('/getInitialState', {
            params: paramObj,
        });
        return response.data;
    }

    async test() {
        const response = await http.get('/test');
        console.log(response.data);
        return response.data;
    }

    // async test(paramObj) {
    //     const response = await http.post('/get_next_step', {
    //         data: paramObj,
    //     });
    //     return response.data;
    // }
}

export default new API()