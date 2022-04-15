import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import API from '../services/api.js';
import Modal from "./Modal.jsx";
import HelpButton from "./HelpButton.jsx";
import const_styles from "../constants/const_styles.jsx";

const styles = {
    button: [
        'px-4', 'py-2',
        'rounded-full',
        'text-white',
        'font-medium'
    ].join(' '),
    proc_button: [
        'rounded-lg', 'p-2', 'text-white', "w-full",
        'bg-mint-2', 'hover:bg-mint-3'
        // 'bg-gradient-to-l', 'from-blue', 'to-mint',
        // 'hover:from-[#3063c8] hover:to-[#13d28f]'
    ].join(' '),
};

const Instructions = (
    {
        currentSteps, executeProcessorAction, getNextStep,
        hideStepButton, disableStepButton, disableProcButtons,
        disableProcAction, setDisableProcAction
    }
) => {

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [writeInput, setWriteInput] = useState("");
    const [writeProc, setWriteProc] = useState(0);

    const handleTextInput = (e) => {
        setWriteInput(e.target.value);
    }

    const toggleModal = () => {
        setShowModal(!showModal);
    }

    const handleWriteSubmit = () => {
        // Warning if no input value
        if (writeInput == "") {
            alert.error("Write value not found.");
            return;
        }
        
        executeProcessorAction(writeProc, 'Store', parseInt(writeInput));
        toggleModal();
    }

    const modalBody = 
        <div>
            <div className="flex flex-row gap-x-4 items-center">
                <label htmlFor="writeInput" className={'block font-semibold'}>Write value</label>
                <input id="writeInput" name="writeInput" className={'block border border-medium-grey bg-transparent rounded-lg px-3 py-1 active:border-light-grey'}
                    type="text" value={writeInput} size='10' onChange={handleTextInput}/>
            </div>            
            
            <div className='flex flex-row mt-10 gap-x-3 justify-end	'>
                <button onClick={handleWriteSubmit} className={const_styles.modal_button + ' bg-green text-white font-medium hover:bg-light-green'}>Submit</button>
                <button onClick={toggleModal} className={const_styles.modal_button + ' bg-[#312e5c] text-medium-grey hover:bg-[#3f3b76]'}>Cancel</button>
            </div>
        </div>;

    const modalContent = {
        title: `Write to Processor ${writeProc + 1}`,
        body: modalBody,
    };

    // Endof Modal

    // Clear inputs everytime we get next steps
    useEffect(() => {
        setWriteInput("");
    }, [currentSteps])

    return (
        <div>
            <Modal showModal={showModal} toggleModal={toggleModal} content={modalContent}/>

            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-x-4">
                    <h2 className="text-2xl font-bold font-mono">Instructions</h2>
                </div>   

                {/* // Only show step button if in atomic mode */}
                <div className={"flex flex-row gap-x-2 " + (hideStepButton ? "invisible" : "")}>
                    <button disabled={disableStepButton} className={styles.button + " " + const_styles.disabled_button + ' bg-green text-white hover:bg-light-green'}
                        onClick={() => getNextStep()}
                    >
                        Step &gt;
                    </button>
                </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
                <button disabled={disableProcButtons || disableProcAction[0][0]} className={const_styles.proc_button + " " + const_styles.disabled_button}
                    onClick={() => executeProcessorAction(0, 'Load')}
                >
                    Read P1
                </button>
                <button disabled={disableProcButtons || disableProcAction[0][1]} className={const_styles.proc_button + " " + const_styles.disabled_button}
                    onClick={() => {
                        setWriteProc(0);
                        toggleModal();
                    }}
                >
                    Write P1
                </button>
                
                <button disabled={disableProcButtons || disableProcAction[0][2]} className={const_styles.proc_button + " " + const_styles.disabled_button}
                    onClick={() => executeProcessorAction(0, 'Evict')}
                >
                    Evict P1
                </button>
                <button disabled={disableProcButtons || disableProcAction[1][0]} className={const_styles.proc_button + " " + const_styles.disabled_button}
                    onClick={() => executeProcessorAction(1, 'Load')}
                >
                    Read P2
                </button>
                <button disabled={disableProcButtons || disableProcAction[1][1]} className={const_styles.proc_button + " " + const_styles.disabled_button}
                    onClick={() => {
                        setWriteProc(1);
                        toggleModal();
                    }}
                >
                    Write P2
                </button>
                <button disabled={disableProcButtons || disableProcAction[1][2]} className={const_styles.proc_button + " " + const_styles.disabled_button}
                    onClick={() => executeProcessorAction(1, 'Evict')}
                >
                    Evict P2
                </button>  
                <button disabled={disableProcButtons || disableProcAction[2][0]} className={const_styles.proc_button + " " + const_styles.disabled_button}
                    onClick={() => executeProcessorAction(2, 'Load')}
                >
                    Read P3
                </button>
                <button disabled={disableProcButtons || disableProcAction[2][1]} className={const_styles.proc_button + " " + const_styles.disabled_button}
                    onClick={() => {
                        setWriteProc(2);
                        toggleModal();
                    }}
                >
                    Write P3
                </button>     
                <button disabled={disableProcButtons || disableProcAction[2][2]} className={const_styles.proc_button + " " + const_styles.disabled_button}
                    onClick={() => executeProcessorAction(2, 'Evict')}
                >
                    Evict P3
                </button>              
            </div>
        </div>
    )
}

export default Instructions;