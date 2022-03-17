import React, { useState } from "react";

const styles = {
    button: [
        'px-3', 'py-1',
        'rounded-lg',
    ].join(' '),
};

const Instructions = () => {
    return (
        <div>
            <div className="flex flex-row justify-between">
                <h2 className="text-lg font-bold">Instructions</h2>
                <div className="flex flex-row gap-x-2">
                    <button className={styles.button + ' bg-offwhite'}>Verify</button>
                    <button className={styles.button + ' bg-offwhite'}>Step &gt;</button>
                </div>
            </div>
        </div>
    )
}

export default Instructions;