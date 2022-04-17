import React, { useState } from "react";

const type_to_name = {
    "Bus": "Bus",
    "RequestBus": <span className="rotate-90 w-[30px] whitespace-nowrap translate-y-[-150%] "><span className="text-green">Request</span> Bus</span>,
    "ResponseBus": <span className="rotate-[-90deg] w-[30px] whitespace-nowrap translate-y-[200%]"><span className="text-green">Response</span> Bus</span>
}

const Bus = ({type}) => {
    return (
        <div id={type} className="flex h-full rounded-lg px-4 py-1  border border-light-grey text-center items-center font-monospace font-bold text-lg">
            {type_to_name[type]}
        </div>
    )
}

export default Bus;