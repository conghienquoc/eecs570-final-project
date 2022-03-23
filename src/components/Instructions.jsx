import React, { useState, useEffect } from "react";
import API from '../services/api.js';

const styles = {
    button: [
        'px-3', 'py-1',
        'rounded-lg',
    ].join(' '),
};

const Instructions = ({setCurrentSteps}) => {
    const getNextStep = () => {
        var body = {
            'processor': 1,
            'action': 'GET_S',
        }
        API.getNextStep(body).then( res => {
            setCurrentSteps(res);
        })
    }


    return (
        <div>
            <div className="flex flex-row justify-between">
                <h2 className="text-lg font-bold">Instructions</h2>
                <div className="flex flex-row gap-x-2">
                    <button className={styles.button + ' bg-offwhite'}>Verify</button>
                    <button className={styles.button + ' bg-offwhite'}
                        onClick={() => getNextStep()}
                    >
                        Step &gt;
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Instructions;