import React, { useState } from "react";

const styles = {
};

const Processor = ({id, cache}) => {
    const body = (
        <tr>
            <td>{ cache['state'] !== '' ?  cache['state'] : '—'}</td>
            {/* <td>{ cache['register'] !== '' ?  cache['register'] : '—'}</td> */}
            <td>{ cache['value'] !== '' ?  cache['value'] : '—'}</td>
        </tr>
    );

    return (
        <div id={'P' + id} className="flex flex-row gap-x-4">
            <div className="w-fit h-fit rounded-lg px-4 py-2 font-monospace font-bold text-lg border border-mint text-mint">
                P{id}
            </div>
            <table className="rounded-table text-lg font-monospace">
                <thead className="font-bold ">
                    <tr>
                        <th>State</th>
                        {/* <th>Register</th> */}
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        </div>
    )
}

export default Processor;
