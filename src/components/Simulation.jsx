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


const Simulation = () => {
    const cache = [
        {
          state: 'I',
          register: 'A',
          value: '',
        },
        {
          state: 'M',
          register: 'B',
          value: '2',
        }
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

        console.log(line1);

    }, []);


    return (
        <div className="flex flex-row gap-x-28 items-center justify-between">
            <div className="flex flex-col gap-y-16">
                <div className="relative">
                    <Processor id={1} cache={cache}/>
                    <button className="absolute right-[-2.5rem] top-0 rounded-full border bg-red w-[30px] h-[30px] text-white"
                        onClick={() => showLine(line1)}
                    >
                        1
                    </button>
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