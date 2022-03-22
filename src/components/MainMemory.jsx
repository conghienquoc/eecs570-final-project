import React, { useState } from "react";

const styles = {
};

const MainMemory = ({cache}) => {
    const body = cache.map(row => {
        return (
            <tr>
                <td>{ row['state'] }</td>
                <td>{ row['register'] }</td>
                <td>{ row['value'] }</td>
            </tr>
        );
    })


    return (
        <div id="main_memory" className="flex flex-col gap-y-2">
            <div className="rounded-lg px-3 py-1 border border-offblack text-center">
                Main Memory
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

export default MainMemory;