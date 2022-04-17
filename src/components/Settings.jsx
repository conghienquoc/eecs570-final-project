import React, { useState } from "react";
import Switch from "./Switch";
import API from '../services/api';
import CoherencyState from "../utils/coherency-states";
import HelpButton from "./HelpButton";
import const_styles from "../constants/const_styles";
import Modal from "./Modal";


const protocols = {
    msi: 'MSI',
    mesi: 'MESI',
    mosi: 'MOSI',
    moesi: 'MOESI'
}

// To send to backend API
const type_backend = {
    "Atomic": "baseline",
    "Split Transaction": "split",
};

const helpTabs = {
    msi: 'MSI',
    mesi: 'MESI',
    mosi: 'MOSI',
    moesi: 'MOESI',
    atomic: "Atomic",
    split: "Split Transaction",
};

const helpBody = {
    msi:
    <div>
        <p className="mb-4"><strong>MSI</strong> utilizes three states:</p>
        <ul className="list-disc list-outside ml-6 flex flex-col gap-y-2">
            <li><strong>M</strong>odified: contains information that is inconsistent with main memory.</li>
            <li><strong>S</strong>hared: contains unmodified information that exists in read-only for at least one cache.</li>
            <li><strong>I</strong>nvalid: the block is not present in the cache or has been invalidated by a bus.</li>
        </ul>
    </div>,
    mesi:
    <div>
        <p>
            <strong>MESI</strong> introduces the Exclusive state in which a processor has exclusive read access to a cache line.
            Requesting write access for a processor in Exclusive state can be done without sending extra instructions to the bus,
            saving bus bandwidth for a read-write access pattern compared to MSI.
        </p>        
    </div>,
    mosi:
    <div>
        <p>
            <strong>MOSI</strong> introduces the Owned state in which one processor has ownership of a block and others are shared. The values in the processors may be dirty.
            The Owned state is reached after a processor reads while another is Modified. The main benefit is that the writeback to memory is deferred until the owner is evicted.
        </p>
    </div>,
    moesi:
    <div>
        <p>
            <strong>MOESI</strong> is a full cache coherency protocol that includes all of the possible states commonly used in other protocols.
            In addition to the four common MESI protocol states, there is a fifth Owned state representing data that is both modified and shared.
            This avoids the need to write modified data back to main memory before sharing it. The write-back may be deferred. 
        </p>
    </div>,
    atomic:
    <div>
        <p>
        This option assumes an atomic bus with atomic requests and atomic transactions.
        Atomic requests ensure that a processor can send out a request on the bus without worrying that another processor's request will be ordered ahead of its own.
        Atomic transactions ensure that no further requests can be issued on the bus until after the current transaction is completed.
        </p>
    </div>,
    split:
    <div>
        <p>
        This option assumes a non-atomic bus where requests and responses can be interleaved from different processors.
        Order of responses do not necessarily match with the order of the requests.
        </p>
    </div>    
}

const styles = {
    tab: [
        'text-medium-grey', 'hover:text-white',
        'rounded-tl-lg', 'rounded-tr-lg',
        'border-b-[1.5px]', 'border-medium-grey',
        'py-1', 'px-4', 
        ' ',
    ].join(' '),
    tab_active: [
        '!text-white', 'border-t-[1.5px]','border-l-[1.5px]', 'border-r-[1.5px]', '!border-b-0',
        'font-semibold',
    ].join(' '),
};


const Settings = ({setProcessors, setMemory, setCurrentType, setRunning, disableGetInitialState, enableValidInstructions}) => {
    const [protocol, setProtocol] = useState(protocols.msi);

    // To display on the frontend
    const type_display = protocol === protocols.msi ? {
        atomic: "Atomic",
        split: "Split Transaction",
    } : {atomic: "Atomic",};
    const [type, setType] = useState(type_display.atomic);


    const getInitialState = () => {
        setCurrentType("");     // Reset current type for app
        var params = {
            protocol: protocol,
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

            // Get valid instructions
            enableValidInstructions();
        });
    };

    const reset = () => {
        API.clearMachine().then(res => {
            window.location.reload();
        });        
    }

    // Modal
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [activeTab, setActiveTab] = useState('msi');

    const toggleSettingsModal = () => {
        setShowSettingsModal(!showSettingsModal);
    }

    const modalBody = 
        <div>
            <div className="flex flex-row items-stretch mb-8">
                {Object.keys(helpTabs).map((item) => {
                    let isActive = activeTab === item;

                    return (
                        <button onClick={() => setActiveTab(item)} className={styles.tab + (isActive ? styles.tab_active : '')}>
                            {helpTabs[item]}
                        </button>
                    )
                })}
                <div className="flex-1 border-b-[1.5px] border-medium-grey"/>
            </div>
            <div className="min-h-[250px]">
                <p>{helpBody[activeTab]}</p>                
            </div>            
            
            <div className='flex flex-row mt-10 gap-x-3 justify-end	'>
                <button onClick={toggleSettingsModal} className={const_styles.modal_button + ' bg-[#312e5c] text-medium-grey hover:bg-[#3f3b76]'}>Close</button>
            </div>
        </div>;


    const settingsModalContent = {
        title: `Help: Settings`,
        body: modalBody,
    };



    // Endof Modal

    return (
        <div className="flex flex-col gap-y-2">
            <Modal showModal={showSettingsModal} toggleModal={toggleSettingsModal} content={settingsModalContent} size={'lg'}/>

            <div className="flex flex-row gap-x-4 mb-2">
                <h2 className="text-2xl font-bold font-mono">Settings</h2>
                <HelpButton toggleModal={toggleSettingsModal}/>
            </div>            

            <div className="flex flex-col gap-y-2 items-stretch mb-2">
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
            <div className="flex flew-row gap-x-3 justify-end">
                <button className={`rounded-full bg-gradient-to-l from-blue to-mint text-white font-medium
                 disabled:bg-none px-4 py-2 hover:from-[#3063c8] hover:to-[#13d28f]
                 drop-shadow-lg ` + const_styles.disabled_button}
                    disabled={disableGetInitialState}
                    onClick={() => getInitialState()}
                >
                    Get initial state
                </button>
                <button className={`bg-blue text-white font-medium px-4 py-2 rounded-full hover:bg-[#3063c8] drop-shadow-lg ` + const_styles.disabled_button}
                    onClick={() => reset()}>
                    Reset
                </button>
            </div>            
        </div>
    )
}

export default Settings;