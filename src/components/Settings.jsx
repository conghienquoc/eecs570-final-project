import React, { useState } from "react";
import Switch from "./Switch";
import API from '../services/api';
import CoherencyState from "../utils/coherency-states";


const schemes = {
    snooping: 'Snooping-based',
    directory: 'Directory-based'
}

const protocols = {
    msi: 'MSI',
    mesi: 'MESI',
    mosi: 'MOSI'
}

const transients = {
    no: 'Non-Transient',
    yes: 'Transient'    
}

const Settings = ({setProcessors, setMemory}) => {
    const [scheme, setScheme] = useState(schemes.snooping);
    const [protocol, setProtocol] = useState(protocols.msi);
    const [transient, setTransient] = useState(transients.no);

    const getInitialState = () => {
        var params = {
            scheme: scheme === schemes.snooping ? 'snooping' : 'directory',
            protocol: protocol.toLowerCase(),
            transient: transient === transients.yes,
        };
        API.getInitialState(params).then( res => {
            // Set initial state for all processors
            var procs_initial_state = res.slice(0,-1).map((proc) => {
                return {
                    state: CoherencyState['Invalid'],
                    register: proc.register,
                    value: proc.value,
                    new_value: null,
                    new_state: null,
                }
            })
            setProcessors(procs_initial_state);

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
            <Switch 
                options={[schemes.snooping, schemes.directory]}
                active={scheme}
                toggleFunc={setScheme}
            />
            <Switch
                options={Object.values(protocols)}
                active={protocol}
                toggleFunc={setProtocol}
            />
            <Switch
                options={Object.values(transients)}
                active={transient}
                toggleFunc={setTransient}
            />
            <button className="rounded-lg bg-blue p-2 text-white"
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