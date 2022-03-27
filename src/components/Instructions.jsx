import React, { useState, useEffect } from "react";
import API from '../services/api.js';

const styles = {
    button: [
        'px-3', 'py-1',
        'rounded-lg',
    ].join(' '),
};

const Instructions = ({currentSteps, sendRequest}) => {
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");
    const [input3, setInput3] = useState("");

    const handleTextInput1 = (e) => {
        setInput1(e.target.value);
    }

    const handleTextInput2 = (e) => {
        setInput2(e.target.value);
    }

    const handleTextInput3 = (e) => {
        setInput3(e.target.value);
    }

    // Clear inputs everytime we get next steps
    useEffect(() => {
        setInput1("");
        setInput2("");
        setInput3("");
    }, [currentSteps])

    return (
        <div>
            <h2 className="text-lg font-bold">Instructions</h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
                <button className="rounded-lg p-2 bg-red text-white"
                    onClick={() => sendRequest(0, 'GET_S')}
                >
                    Read Processor 1
                </button>
                <div className="flex flex-col">
                    <button className="rounded-lg p-2 bg-red text-white mb-1"
                        onClick={() => sendRequest(0, 'GET_M', input1)}
                    >
                        Write Processor 1
                    </button>
                    <div>
                        Value:
                        <input className="ml-2 text-offblack border border-offblack rounded-md" size = "5" value={input1}
                            onChange={handleTextInput1}
                        />
                    </div>
                    
                </div>
                
                <button className="rounded-lg p-2 bg-red text-white"
                    onClick={() => sendRequest(0, 'EVICT')}
                >
                    Evict Processor 1
                </button>
                <button className="rounded-lg p-2 bg-red text-white"
                    onClick={() => sendRequest(1, 'GET_S')}
                >
                    Read Processor 2
                </button>
                <div className="flex flex-col">
                    <button className="rounded-lg p-2 bg-red text-white mb-1"
                        onClick={() => sendRequest(1, 'GET_M', input1)}
                    >
                        Write Processor 2
                    </button>
                    <div>
                        Value:
                        <input className="ml-2 text-offblack border border-offblack rounded-md" size = "5" value={input2}
                            onChange={handleTextInput2}
                        />
                    </div>
                </div>
                <button className="rounded-lg p-2 bg-red text-white"
                    onClick={() => sendRequest(1, 'EVICT')}
                >
                    Evict Processor 2
                </button>  
                <button className="rounded-lg p-2 bg-red text-white"
                    onClick={() => sendRequest(2, 'GET_S')}
                >
                    Read Processor 3
                </button>
                <div className="flex flex-col">
                    <button className="rounded-lg p-2 bg-red text-white mb-1"
                        onClick={() => sendRequest(2, 'GET_M', input1)}
                    >
                        Write Processor 3
                    </button>
                    <div>
                        Value:
                        <input className="ml-2 text-offblack border border-offblack rounded-md" size = "5" value={input3}
                            onChange={handleTextInput3}
                        />
                    </div>                    
                </div>
                <button className="rounded-lg p-2 bg-red text-white"
                    onClick={() => sendRequest(2, 'EVICT')}
                >
                    Evict Processor 3
                </button>              
            </div>
        </div>
    )
}

export default Instructions;