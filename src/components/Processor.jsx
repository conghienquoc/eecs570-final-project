import React, { useState } from "react";

const styles = {
};

const Processor = ({id}) => {
    return (
        <div className="flex flex-row gap-x-2">
            <div className="w-fit h-fit rounded-lg px-3 py-1 border border-medium-grey">
                P{id}
            </div>
            <table className="table-fixed border-collapse border border-medium-grey text-center rounded-[15px]">
                <thead>
                    <tr>
                        <th>State</th>
                        <th>Register</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>I</td>
                        <td>A</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Processor;