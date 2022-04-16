import React, { useState, useEffect } from "react";
import Processor from "./Processor";
import Bus from "./Bus";
import MainMemory from "./MainMemory";
import LeaderLine from "react-leader-line";
import API from "../services/api";
import CoherencyState from "../utils/coherency-states";
import const_styles from "../constants/const_styles";
import Modal from "./Modal";

const styles = {
};

const showEffect = {
    default: "fade",
    none: "none",
    draw: "draw"
};

const actions = {
    busRd: "BusRead",
    busReply: "BusReply",
    update: "Update",
    data: "Data",
    hit: "Hit",
    stall: "Stall",
}

const num_to_id = {
    "0": "P1",
    "1": "P2",
    "2": "P3",
    "-1": "Memory",
    "-2": "Bus",
}

const num_to_index = {
    "0": 0,
    "1": 1,
    "2": 2,
    "-1": 3,
    "-2": 4,
}

const colors = [
    "#00c75f",
    "#8980F5",
    "#0892A5",
    "#55286F",      
    "#F25757",
]


const Simulation = (
    {
        processors, memory, bus_instructions, current_steps,
        queue_instructions,
        setProcessors, setMemory,
        lines, tooltip_buttons, setTooltipButtons,
        disableBusButtons, getNextStep,
        executeQueueEvent, currentType
    }
) => {
    
    // var lines = []
    let existing_edges = [] // Keep track of pairs of endpoints to handle overlapping
    // const [existing_edges, setExistingEdges] = useState([]);

    const showLine = (line) => {
        if (line === null) return;

        line.show(['draw']);
    }

    const createLine = (src_id, dst_id, label, end_socket="auto", color="red") => {
        console.log(`Creating new line from ${src_id} to ${dst_id} with label ${label}`);
        console.log(`start_socket: ${end_socket}`);
        return new LeaderLine(
            document.getElementById(src_id),
            document.getElementById(dst_id),
            {
                // dash: { animation: true },
                hide: true,
                endLabel: LeaderLine.captionLabel(label, {
                    'fontFamily': 'Space Mono',
                    'outlineColor': '',
                    'fontWeight': '700',
                    'fontSize': '1.125rem'
                }),
                endSocket: end_socket,
                color: color,
            }
        );
    }

    const step_button = (i, color, handleClick) => {
        const bg_color = `bg-[${color}]`;
        return (
            <button
                className={"rounded-full w-[30px] h-[30px] text-white z-50 " + bg_color}
                onClick={handleClick}>
                    {i + 1 /* Because of 0-index*/} 
            </button>
        )
    }

    const create_step_buttons = (index_in_tooltip_buttons) => {
        return tooltip_buttons[index_in_tooltip_buttons].map((btn) => {
            const color = colors[btn.index];

            // Update actions
            if (btn.action === actions.update) {
                if (btn.src === -2) {
                    throw 'Cannot update bus';
                }
                else if (btn.src === -1) {
                    updateMemory(btn.value);
                    return step_button(btn.index, color, () => {
                        showMemoryChange(color);
                    });
                }
                else {
                    updateProc(btn.src, btn.value, btn.state);
                    return step_button(btn.index, color, () => {
                        showProcChange(btn.src, color);
                    });
                }                        
            }

            // Other actions
            // Add connecting line and tooltip button
            let newLine = null;
            if (btn.src !== btn.dst) {
                // If there's already a line between these two nodes 
                // then the new line should be drawn from different points to avoid overlapping
                const edge = [Math.min(btn.src, btn.dst), Math.max(btn.src, btn.dst)].join();
                var end_socket = "auto";
                if (existing_edges.includes(edge)) {
                    end_socket = "bottom";
                }
                else {
                    existing_edges.push(edge); 
                }

                // If memory sending data, then specify the value
                let label = btn.action === actions.data ? `${btn.action}: ${btn.value}` : btn.action;

                newLine = createLine(num_to_id[btn.src.toString()], num_to_id[btn.dst.toString()], label, end_socket, color);
                lines.push(newLine);                         
            }

            return step_button(btn.index, color, () => showLine(newLine));
        })
    }

    const updateProc = (proc_idx, new_val, new_state) => {
        if (processors[proc_idx].new_value === new_val && processors[proc_idx].new_state === new_state) return;

        var new_processors = processors.slice(0);
        console.log(new_processors[proc_idx]);
        new_processors[proc_idx].new_value = new_val;
        new_processors[proc_idx].new_state = new_state;
        setProcessors(new_processors);
    }

    const updateMemory = (new_val) => {
        if (memory.new_value === new_val) return;

        var new_memory = JSON.parse(JSON.stringify(memory));
        new_memory.new_value = new_val;
        setMemory(new_memory);
    }

    const showProcChange = (proc_idx, color) => {
        var new_processors = processors.slice(0);

        // Update value if new value changes
        if ((processors[proc_idx].new_value !== null || processors[proc_idx].new_state === 'I') && processors[proc_idx].new_value !== processors[proc_idx].value) {            
            // Prevent value keep changing with multiple button clicks
            if (typeof(new_processors[proc_idx].value) == "number" || new_processors[proc_idx].value === "") {
                new_processors[proc_idx].value = <span><del>{new_processors[proc_idx].value}</del> <strong className={`text-[${color}]`}>{processors[proc_idx].new_value}</strong></span>;
            }
        }

        // Update state if new state changes
        if (processors[proc_idx].new_state !== processors[proc_idx].state) {
            // Prevent value keep changing with multiple button clicks
            if (typeof(new_processors[proc_idx].state) == "string") {
                new_processors[proc_idx].state = <span><del>{new_processors[proc_idx].state}</del> <strong className={`text-[${color}]`}>{processors[proc_idx].new_state}</strong></span>;
            }
        }

        setProcessors(new_processors);
    }

    const showMemoryChange = (color) => {
        var new_memory = JSON.parse(JSON.stringify(memory));

        // Prevent value keep changing with multiple button clicks
        // if (memory.new_value !== memory.value && typeof(memory.value) == "number") {
        //     new_memory.value = <span><del>{memory.value}</del> <strong className={`text-[${color}]`}>{memory.new_value}</strong></span>;
        // }

        // Update value if new value changes
        if (memory.new_value !== null && memory.new_value !== memory.value) {            
            // Prevent value keep changing with multiple button clicks
            if (typeof(memory.value) == "number") {
                new_memory.value = <span><del>{memory.value}</del> <strong className={`text-[${color}]`}>{memory.new_value}</strong></span>;
                setMemory(new_memory);
            }
        }

        
    }


    const create_queue = (i) => {
        if (currentType !== "Split Transaction") return null;
        
        let buttons = null;
        let instructions = queue_instructions[num_to_index[i.toString()]];

        if (instructions.length > 0) {
            buttons = instructions.map((instruction, i) =>
                <button className={"flex-1 !py-1 " + const_styles.proc_button + " " + const_styles.disabled_button}
                    disabled={i !== 0}
                    onClick={() => executeQueueEvent(i)}>
                    {`${instruction['action']}`}
                </button>
            );            
        }

        let queue_events =
        <div className="flex flex-row mt-5 gap-x-4 items-baseline">
            <div className="flex-0">
                Queue:
            </div>
            <div className="flex flex-col flex-1 gap-y-2">
                {buttons}
            </div>
            
        </div>;
        

        return queue_events;
    }
    

    // Divs for all the subparts so we can have dynamic buttons for the lines

    const processor_divs = processors.map((p, i) => {
        

        return (
            <div key={'P' + (i+1)} id={'P' + (i+1) + '-wrapper'} className="relative">
                <Processor id={i+1} cache={p}/>

                <div className="absolute flex flex-col top-0 right-[-3rem] gap-1">
                    {create_step_buttons(i)}
                </div>
                {create_queue(i)}
            </div>
        );        
    }
        
    )


    // Memory div
    const memory_div = (
        <div className="relative">
            <MainMemory cache={memory} />

            <div className="absolute flex flex-col top-0 left-[-2.5rem] gap-1">
                {/* 3 is index of main memory in tooltip buttons */}
                {create_step_buttons(3)}
            </div>

            {create_queue(-1)}
        </div>
    )

    // Endof Memory div

    const bus_div = (
        <div className="relative self-stretch">
            <Bus/>

            <div className="absolute flex flex-col top-0 right-[-2.5rem] gap-1">
                {/* 4 is index of main memory in tooltip buttons */}
                {create_step_buttons(4)}
            </div>  
        </div>
    )

    // Only allow bus buttons to be clicked in split transaction mode
    const bus_instruction_buttons = bus_instructions.map((instruction, i) => 
        <button className={const_styles.proc_button + " " + const_styles.disabled_button} disabled={disableBusButtons}
            onClick={() => getNextStep(i)}
        >
            {instruction.action} from {num_to_id[instruction.src.toString()]}
        </button>
    )

    // Modal
    const [showSimModal, setShowSimModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalText, setModalText] = useState("");

    const toggleModal = () => {
        setShowSimModal(!showSimModal);
    }

    const modalBody = 
        <div>
            <div className="flex flex-row gap-x-4 items-center">
                {modalText}
            </div>            
            
            <div className='flex flex-row mt-10 gap-x-3 justify-end	'>
                <button onClick={toggleModal} className={const_styles.modal_button + ' bg-[#312e5c] text-medium-grey hover:bg-[#3f3b76]'}>Close</button>
            </div>
        </div>;

    const modalContent = {
        title: modalTitle,
        body: modalBody,
    };

    // Endof Modal
    
    // Add tooltip for each step and update bus instructions
    useEffect(() => {
        if (current_steps.length === 0) return;
        
        current_steps.forEach((step, i) => {
            let src;
            let dst;

            if (step['action'] === actions.update) {
                // For memory that's just updating the state, don't display
                if (step['target'] === -1 && step["value"] === memory.value) return;
                
                src = step['target'];
                dst = src;
            }
            else if (step['action'] === actions.hit) {
                setModalTitle('Cache hit!');
                setModalText(`Cache hit on processor ${step['target'] + 1}.`);
                toggleModal();
                return;
            }
            else if (step['action'] === actions.stall) {
                setModalTitle('Stalling...');
                if (step['target'] !== -1) setModalText(`Stalling on processor ${step['target'] + 1}.`);
                else setModalText(`Stalling on memory.`);                
                toggleModal();
                return;
            }
            else {
                src = step['src'];
                dst = step['dst'];
            }

            let action = {
                'src': src,
                'dst': dst,
                'index': i,
                'action': step['action'],
                'value': step['value'] === 9223372036854776000 ? '' : step['value'],        // 9223372036854776000 is undefined val in backend
                // 'state': step['state'] !== undefined ? CoherencyState[step['state']] : undefined,
                'state': step['state'],
            }

            // Add action to be processed in bus
            // if (dst === -2) {
            //     let new_bus_instructions = bus_instructions.slice(0);
            //     new_bus_instructions.push(action);
            //     setBusInstructions(new_bus_instructions);
            // }

            // Add tooltip buttons
            let new_tooltip_buttons = tooltip_buttons.slice(0);
            new_tooltip_buttons[num_to_index[src.toString()]].push(action);
            setTooltipButtons(new_tooltip_buttons);

        });
    }, [current_steps])

    return (
        <div>
            <Modal showModal={showSimModal} toggleModal={toggleModal} content={modalContent}/>

            <div className="flex flex-row gap-x-28 items-center justify-between">
                <span className="bg-[#00c75f] bg-[#8980F5] bg-[#F25757] bg-[#0892A5] bg-[#55286F]
                                text-[#00c75f] text-[#8980F5] text-[#F25757] text-[#0892A5] text-[#55286F] hidden"></span>
                <div className="flex flex-col gap-y-16">
                    {processor_divs}

                </div>

                {bus_div}
                
                {memory_div}          
            </div>

            <div className="mt-10 flex flex-col justify-center items-center gap-y-2 ml-20">
                <h2 className="text-lg text-primary-light">Waiting Bus Instructions</h2>
                {bus_instruction_buttons}
            </div>
            
        </div>
        
    )
}

export default Simulation;