import React, { useState } from "react";

const styles = {
};

const Processor = ({id, cache}) => {
    const body = cache.map((row, i) => {
        return (
            <tr key={i}>
                <td>{ row['state'] }</td>
                <td>{ row['register'] }</td>
                <td>{ row['value'] }</td>
            </tr>
        );
    })


    return (
        <div id={'P' + id} className="flex flex-row gap-x-2">
            <div className="w-fit h-fit rounded-lg px-3 py-1 border border-offblack font-bold">
                P{id}
            </div>
            <table className="rounded-table">
                <thead className="bg-light-grey">
                    <tr>
                        <th>State</th>
                        <th>Register</th>
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