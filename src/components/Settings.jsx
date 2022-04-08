import React, { useState } from "react";
import Switch from "./Switch";
import API from '../services/api';
import CoherencyState from "../utils/coherency-states";


const protocols = {
    msi: 'MSI',
    mesi: 'MESI',
    mosi: 'MOSI'
}

// To send to backend API
const type_backend = {
    "Atomic": "baseline",
    "Split Transaction": "split",
};

// To display on the frontend
const type_display = {
    atomic: "Atomic",
    split: "Split Transaction",
}

const Settings = ({setProcessors, setMemory, setCurrentType, setRunning, disableGetInitialState}) => {
    const [protocol, setProtocol] = useState(protocols.msi);
    const [type, setType] = useState(type_display.atomic);

    const getInitialState = () => {
        setCurrentType("");     // Reset current type for app
        var params = {
            protocol: protocol.toLowerCase(),
            type: type_backend[type],
        };
        API.getInitialState(params).then( res => {
            // Set initial state for all processors
            var procs_initial_state = res.slice(0,-1).map((proc) => {
                return {
                    state: CoherencyState['Invalid'],
                    register: proc.register,
                    value: proc.value === 9223372036854776000 ? '' : proc.value,   // 9223372036854776000 is undefined value in the backend
                    new_value: null,
                    new_state: null,
                }
            })
            setProcessors(procs_initial_state);
            setCurrentType(type);   // Set current type for app to disable correct buttons
            setRunning(true);

            // Set initial state for main memory
            var memory_initial_state = {
                register: res[res.length - 1].register,
                value: res[res.length - 1].value,
                new_value: null,
            }
            setMemory(memory_initial_state);
        });
    };

    const reset = () => {
        API.clearMachine().then(res => {
            window.location.reload();
        });        
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-2 items-stretch">
                <Switch
                    options={Object.values(protocols)}
                    active={protocol}
                    toggleFunc={setProtocol}
                />
                <Switch
                    options={Object.values(type_display)}
                    active={type}
                    toggleFunc={setType}
                />
            </div>
            <button className="rounded-lg bg-green p-2 text-white disabled:bg-light-grey disabled:text-medium-grey"
                disabled={disableGetInitialState}
                onClick={() => getInitialState()}
            >
                Get initial state
            </button>
            <button className='bg-blue text-white p-2 rounded-lg'
                onClick={() => reset()}>
                Reset
            </button>
        </div>
    )
}

export default Settings;