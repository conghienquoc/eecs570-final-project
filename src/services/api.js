import http from '../utils/http-common';

class API {
    async getInitialState(paramObj) {
        console.log(paramObj);

        const response = await http({
            method: 'GET',
            url: "get_initial_state",
        })
        console.log(response.data);
        return response.data;
    }


    async getNextStep(paramObj) {
        console.log(paramObj);

        const response = await http({
            method: 'POST',
            url: "get_next_step",
            data: paramObj,
        })
        console.log(response.data)
        return response.data;
    }


    async clearMachine() {
        const response = await http.get('/clear_machine');
        console.log(response.data);
        return response.data;
    }


    async getValidInstructions() {
        const response = await http.get('/get_valid_instructions');
        console.log(response.data);
        return response.data;
    }

    async executeProcessorAction(paramObj) {
        console.log(paramObj);
        const response = await http({
            method: 'POST',
            url: "execute_processor_action",
            data: paramObj, // {'processor': 0-index, and 'action' (Load, Evict, Store)}
        })
        console.log(response.data)  
        return response.data;
    }

    
    async getBusEvents() {
        const response = await http.get('/get_bus_events');
        console.log(response.data);
        return response.data;
    }

    async executeBusEvent(paramObj) {
        const response = await http({
            method: 'POST',
            url: "execute_bus_event",
            data: paramObj,
        })
        console.log(response.data)  
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