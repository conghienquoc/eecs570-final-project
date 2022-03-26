import React, { useState } from "react";
import Switch from "./Switch";
import API from '../services/api';


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

const Settings = () => {
    const [scheme, setScheme] = useState(schemes.snooping);
    const [protocol, setProtocol] = useState(protocols.msi);
    const [transient, setTransient] = useState(transients.no);

    const getInitialState = () => {
        var params = {
            scheme: scheme === schemes.snooping ? 'snooping' : 'directory',
            protocol: protocol.toLowerCase(),
            transient: transient === transients.yes,
        };
        API.getInitialState(params);
    };

    const clear = () => {
        API.clearMachine();
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
                onClick={() => clear()}>
                Clear Backend
            </button>
        </div>
    )
}

export default Settings;