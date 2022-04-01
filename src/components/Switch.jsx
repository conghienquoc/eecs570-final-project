import React from "react";


const styles = {
    switch: [
        'px-3', 'py-1',
        'rounded-lg',
        'text-medium-grey',
        'flex-1'
    ].join(' '),
    active_switch: [
        '',
        'bg-white',
        '!text-offblack'
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
        <div className="flex flex-row items-stretch gap-x-2 rounded-xl bg-light-grey px-3 py-2">
            {switches}
        </div>
    )
}

export default Switch;