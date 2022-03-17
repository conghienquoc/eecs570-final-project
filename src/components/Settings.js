import React, { useState } from "react";
import Switch from "./Switch";


const schemes = {
    snooping: 'Snooping-based',
    directory: 'Directory-based'
}


const Settings = () => {
    const [scheme, setScheme] = useState(schemes.snooping);

    return (
        <div>
            <Switch
                options={[schemes.snooping, schemes.directory]}
                active={scheme}
                toggleFunc={setScheme}
            />
        </div>
    )
}

export default Settings;