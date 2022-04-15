import React, { useState } from "react";

const styles = {
};

const MainMemory = ({cache}) => {
    const body = (
        <tr>
            {/* <td>{ cache['register'] !== '' ?  cache['register'] : '—'}</td> */}
            <td>{ cache['value'] !== '' ?  cache['value'] : '—'}</td>
        </tr>
    );


    return (
        <div id="Memory" className="flex flex-col gap-y-4">
            <div className="w-fit h-fit rounded-lg px-4 py-2 font-monospace font-bold text-lg bg-gradient-to-r from-blue to-purple">
                Main Memory
            </div>
            <table className="rounded-table-one-col text-lg font-monospace">
                <thead className="font-bold">
                    <tr>
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

export default MainMemory;