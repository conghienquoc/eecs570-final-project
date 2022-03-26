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


const Simulation = ({}) => {
    const [currentSteps, setCurrentSteps] = useState([]);

    const getNextStep = () => {
        var body = {
            'processor': 1,
            'action': 'GET_S',
        }
        API.getNextStep(body).then( res => {
            setCurrentSteps(res);
        })
    }

    const cache = 
        {
          state: 'I',
          register: 'A',
          value: '',
        };
    

    const [processors, setProcessors] = useState([
        {
            state: 'I',
            register: 'A',
            value: '',
        },
        {
            state: 'S',
            register: 'A',
            value: '10',
        }
    ]);

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
    }, []);

    const step_button = (i) => {
        <button className="absolute right-[-2.5rem] top-0 rounded-full border bg-red w-[30px] h-[30px] text-white"
        onClick={() => showLine(line1)}>
            {i}
        </button>
    }
    
    // Add tooltip for each step
    useEffect(() => {
        if (currentSteps.length === 0) return;
        
        currentSteps.map((step, i) => {
            var src;

            if (step['action'] === actions.update) {
                src = step['target'];
            }
            else {
                src = step['src'];
            }
            // Place the tooltip button at the correct place
            if (src === -1) {
                document.querySelector('#main_memory').appendChild(step_button(i))
            }   // Main Memory
            else if (src === -2){
                document.querySelector('#bus').appendChild(step_button(i))
            }   // Bus
            else {
                // console.log(processor_divs[i])
                // processor_divs[i] = <div>hi</div>
                // console.log(processor_divs[i])
                var new_procs = processors;
                new_procs[src].value = '231';
                console.log(new_procs[src]);
                console.log(new_procs);
                setProcessors([]);
            }   // Processor


        });
    }, [currentSteps])


    const processor_divs = processors.map((p, i) => 
        <Processor id={i} cache={p}/>
    )

    return (
        <div className="flex flex-row gap-x-28 items-center justify-between">
            <div className="flex flex-col gap-y-16">
                {/* <div className="relative">
                    <Processor id={1} cache={cache}/>
                    <button className="absolute right-[-2.5rem] top-0 rounded-full border bg-red w-[30px] h-[30px] text-white"
                    onClick={() => showLine(line1)}>
                        1
                    </button>
                </div>
                <div className="relative">
                    <Processor id={2} cache={cache}/>
                </div> */}
                {processor_divs}
                <button onClick={() => getNextStep()}>next</button>
                {JSON.stringify(processors)}
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