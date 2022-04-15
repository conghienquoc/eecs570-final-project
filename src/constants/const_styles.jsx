const const_styles = {
    modal_button: [
        'block',
        'px-4', 'py-2',
        'rounded-lg'
    ].join(' '),
    disabled_button: [
        'disabled:bg-none', 'disabled:bg-white/[0.05]', 'disabled:backdrop-blur-sm', "disabled:text-dark-grey"
    ].join(' '),
    proc_button: [
        'rounded-lg', 'px-4 py-3', 'text-white',
        'bg-green', 'hover:bg-light-green',
        'font-monospace', 'text-lg', 'font-bold'
        // 'bg-gradient-to-l', 'from-blue', 'to-mint',
        // 'hover:from-[#3063c8] hover:to-[#13d28f]'
    ].join(' '),
};

export default const_styles;