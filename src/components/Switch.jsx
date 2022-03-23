import React from "react";


const styles = {
    switch: [
        'px-3', 'py-1',
        'rounded-lg',
        'text-medium-grey',
    ].join(' '),
    active_switch: [
        '',
        'bg-white',
        'text-offblack'
    ].join(' '),
};


const Switch = ({options, active, toggleFunc}) => {
    const switches = options.map((option, i) => {
        const isActive = active === option;

        return (
            <button key={i} className={styles.switch + (isActive ? styles.active_switch : '')}
            onClick={() => toggleFunc(option)}>
                {option}
            </button>
        )
    })

    return (
        <div className="flex flex-row gap-x-2 rounded-xl bg-light-grey w-fit px-3 py-2">
            {/* <button className="rounded-lg bg-white px-3 py-1">
                {options[0]}
            </button>

            <button className="rounded-lg bg-light-grey px-3 py-1 text-medium-grey">
                {options[1]}
            </button> */}
            {switches}
        </div>
    )
}

export default Switch;