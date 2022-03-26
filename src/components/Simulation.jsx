import React, { useState, useRef, useEffect, forwardRef } from "react";
import Processor from "./Processor";
import Bus from "./Bus";
import MainMemory from "./MainMemory";
import LeaderLine from "react-leader-line";
import API from "../services/api";

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


const Simulation = ({processors, current_steps}) => {
    const [tooltip_buttons, setTooltipButtons] = useState([[], [], [], [], []]);   // Arr of 5 elts [p0, p1, p2, bus, mem]
    const [lines, setLines] = useState([]);

    const cache = 
        {
          state: 'I',
          register: 'A',
          value: '',
        };

    var line1;

    const showLine = (line) => {
        line.show(['draw']);
    }

    const createLine = (src_id, dst_id) => {
        return new LeaderLine(
            document.getElementById(src_id),
            document.getElementById(dst_id),
            {
                dash: { animation: true },
                hide: true,
                middleLabel: 'BusRd',
            }
        );
    }

    useEffect(() => {
        line1 = createLine('P1', 'bus')
        console.log(line1);
    }, []);

    const step_button = (i) => {
        return (
            <button
                className={"rounded-full border bg-red w-[30px] h-[30px] text-white"}
                onClick={() => showLine(line1)}>
                    {i}
            </button>
        )
    }

    const processor_divs = processors.map((p, i) => 
        <div id={'P' + i + '-wrapper'} className="relative">
            <Processor id={i} cache={p}/>

            <div className="absolute flex flex-col top-0 right-[-2.5rem] gap-1">
                {tooltip_buttons[i].map((btn) => step_button(btn.step))}
            </div>            
        </div>
    )
    
    // Add tooltip for each step
    useEffect(() => {
        if (current_steps.length === 0) return;
        
        current_steps.map((step, i) => {
            var src;

            if (step['action'] === actions.update) {
                src = step['target'];
            }
            else {
                src = step['src'];
            }
            // Place the tooltip button at the correct place
            if (src === -1) {
                // document.querySelector('#main_memory').appendChild(step_button(i))
            }   // Main Memory
            else if (src === -2){
                // document.querySelector('#bus').appendChild(step_button(i))
            }   // Bus
            else {
                var new_tooltip_buttons = tooltip_buttons.slice(0);
                new_tooltip_buttons[src].push({
                    'step': i + 1,  // Since i is 0-indexed
                })
                setTooltipButtons(new_tooltip_buttons);
            }   // Processor


        });
    }, [current_steps])

    return (
        <div className="flex flex-row gap-x-28 items-center justify-between">
            <div className="flex flex-col gap-y-16">
                {processor_divs}
            </div>
            <div className="relative self-stretch">
                <Bus/>
            </div>
            <div className="relative">
                <MainMemory
                    cache={cache}
                />
            </div>            
        </div>
    )
}

export default Simulation;