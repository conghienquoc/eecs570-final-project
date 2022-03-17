import React, { useState } from "react";
import Switch from "./Switch";


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
        </div>
    )
}

export default Settings;