import React from "react";

const styles = {
    switch: [
        'px-3', 'py-1',
        'rounded-full',
        'text-medium-grey',
        'flex-1',
        'hover:bg-white/[.08]',
    ].join(' '),
    active_switch: [
        '',
        '!text-dark-grey',
        '!font-semibold',
        "!bg-primary-light",
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
        <div className="flex flex-row items-stretch gap-x-2 rounded-full bg-white/[0.12] px-3 py-2 drop-shadow-lg backdrop-blur-sm">
            {switches}
        </div>
    )
}

export default Switch;