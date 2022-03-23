import React, { useState, useRef, useEffect, forwardRef } from "react";
import Processor from "./Processor";
import Bus from "./Bus";
import MainMemory from "./MainMemory";
import LeaderLine from "react-leader-line";

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


const Simulation = ({currentSteps}) => {
    const cache = [
        {
          state: 'I',
          register: 'A',
          value: '',
        },
    ]

    const startRef = useRef();
    const endRef = useRef();
    const tempRef = useRef();
    var line1;

    const showLine = (line) => {
        line.show(['draw']);
    }

    useEffect(() => {

        line1 = new LeaderLine(
            document.getElementById('P1'),
            document.getElementById('bus'),
            {
                dash: { animation: true },
                hide: true,
                middleLabel: 'MIDDLE',
            }
        );

    }, []);

    const step_button = (i) => {
        <button className="absolute right-[-2.5rem] top-0 rounded-full border bg-red w-[30px] h-[30px] text-white"
        onClick={() => showLine(line1)}>
            {i}
        </button>
    }
    
    // Add tooltip 
    useEffect(() => {
        if (currentSteps.length === 0) return;
        
        currentSteps.map((step, i) => {
            if (step.action === actions.update) return;
        });
    }, [currentSteps])


    return (
        <div className="flex flex-row gap-x-28 items-center justify-between">
            <div className="flex flex-col gap-y-16">
                <div className="relative">
                    <Processor id={1} cache={cache}/>
                </div>
                <div>
                    <Processor id={2} cache={cache}/>
                </div>
            </div>          
            <Bus/>            
            <MainMemory
                cache={cache}
            />
        </div>   
    )
}

export default Simulation;