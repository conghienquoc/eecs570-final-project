import React, { useState, useEffect } from "react";
import Processor from "./Processor";
import Bus from "./Bus";
import MainMemory from "./MainMemory";
import LeaderLine from "react-leader-line";
import API from "../services/api";
import CoherencyState from "../utils/coherency-states";

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
}

const num_to_id = {
    "0": "P1",
    "1": "P2",
    "2": "P3",
    "-1": "main_memory",
    "-2": "bus",
}

const num_to_index = {
    "0": 0,
    "1": 1,
    "2": 2,
    "-1": 3,
    "-2": 4,
}

const colors = [
    "#F45B69",
    "#59C3C3",
    "#FF9505",
    "#548C2F",
    "#4062BB",
]


const Simulation = ({processors, memory, current_steps, setProcessors, setMemory, lines, tooltip_buttons, setTooltipButtons}) => {
    
    // var lines = []
    var existing_edges = [] // Keep track of pairs of endpoints to handle overlapping
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
                dash: { animation: true },
                hide: true,
                middleLabel: label,
                endSocket: end_socket,
                color: color,
            }
        );
    }

    const step_button = (i, color, handleClick) => {
        const bg_color = `bg-[${color}]`;
        return (
            <button
                className={"rounded-full border w-[30px] h-[30px] text-white " + bg_color}
                onClick={handleClick}>
                    {i + 1 /* Because of 0-index*/} 
            </button>
        )
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
        if (processors[proc_idx].new_value !== processors[proc_idx].value) {            
            // Prevent value keep changing with multiple button clicks
            if (typeof(new_processors[proc_idx].value) == "number") {
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
        if (memory.new_value !== memory.value && typeof(memory.value) == "number") {
            new_memory.value = <span><del>{memory.value}</del> <strong className={`text-[${color}]`}>{memory.new_value}</strong></span>;
        }

        setMemory(new_memory);
    }

    const processor_divs = processors.map((p, i) => 
        <div id={'P' + (i+1) + '-wrapper'} className="relative">
            <Processor id={i+1} cache={p}/>

            <div className="absolute flex flex-col top-0 right-[-2.5rem] gap-1">
                {tooltip_buttons[i].map((btn) => {
                    const color = colors[btn.index];

                    // Update actions
                    if (btn.action === actions.update) {
                        if (btn.src === -2) {
                            throw 'Cannot update bus';
                        }
                        else if (btn.src === -1) {
                            updateProc(btn.value);
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
                    var newLine = null;
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

                        newLine = createLine(num_to_id[btn.src.toString()], num_to_id[btn.dst.toString()], btn.action, end_socket, color);
                        lines.push(newLine);                         
                    }

                    return step_button(btn.index, color, () => showLine(newLine));
                })}
            </div>            
        </div>
    )
    
    // Add tooltip for each step
    useEffect(() => {
        if (current_steps.length === 0) return;
        
        current_steps.forEach((step, i) => {
            var src;
            var dst;

            if (step['action'] === actions.update) {
                src = step['target'];
                dst = src;
            }
            else {
                src = step['src'];
                dst = step['dst'];
            }

            var new_tooltip_buttons = tooltip_buttons.slice(0);
            new_tooltip_buttons[num_to_index[src.toString()]].push({
                'src': src,
                'dst': dst,
                'index': i,
                'action': step['action'],
                'value': step['value'],
                'state': step['state'] !== undefined ? CoherencyState[step['state']] : undefined,
            })
            setTooltipButtons(new_tooltip_buttons);

        });
    }, [current_steps])

    return (
        <div className="flex flex-row gap-x-28 items-center justify-between">
            <span className="bg-[#F45B69] bg-[#59C3C3] bg-[#FF9505] bg-[#4062BB] bg-[#548C2F]
                             text-[#F45B69] text-[#59C3C3] text-[#FF9505] text-[#4062BB] text-[#548C2F] hidden"></span>
            <div className="flex flex-col gap-y-16">
                {processor_divs}

                {/* <button onClick={() => {
                    lines.forEach((line) => {
                        line.remove();
                    });
                    
                    lines = [];
                    existing_edges = [];
                }}>
                    clear lines
                </button> */}
            </div>
            <div className="relative self-stretch">
                <Bus/>
            </div>
            <div className="relative">
                <MainMemory cache={memory} />
            </div>            
        </div>
    )
}

export default Simulation;