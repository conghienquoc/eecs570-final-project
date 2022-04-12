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
        <div id="Memory" className="flex flex-col gap-y-2">
            <div className="rounded-lg px-3 py-1 border border-offblack text-center font-bold">
                Main Memory
            </div>
            <table className="rounded-table-one-col">
                <thead className="bg-light-grey">
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