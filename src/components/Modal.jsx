import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const styles = {
    pageWrapper: [
        'w-screen', 'h-screen',
        'fixed', 'top-0', 'left-0', 'z-[51]',
        'flex', 'items-center', 'justify-center'
    ].join(' '),
    background: [
        'bg-[#090313]/[.5]', 'h-full w-full', 'fixed'
    ].join(' '),
    modal: [
        'flex', 'flex-col',
        'z-[52]',
        'rounded-xl',
        'bg-[#232142]', 'backdrop-blur-sm', 'drop-shadow-lg',
    ].join(' '),
    modalHeader: [
        'flex', 'flex-row', 'justify-between', 'items-center',
        'min-h-[50px]',
        'pb-5', 'pt-8', 'px-10',
        'border-b-[1.5px]', 'border-medium-grey',
        'text-white', 'text-xl',
    ].join(' '),
    modalBody: [
        'py-8', 'px-10',
        'text-lg'
    ].join(' '),
};

const modal_width = {
    sm: 'w-[400px]',
    md: 'w-[500px]',
    lg: 'w-[700px]',
};


const Modal = ({showModal, toggleModal, content, size='sm'}) => {
    const animation = useSpring({
        config: {
          duration: 250
        },
        opacity: showModal ? 1 : 0,
        transform: showModal ? `translateY(0%)` : `translateY(-100%)`
    });


    return (
        <div className={styles.pageWrapper + (showModal ? '' : ' hidden')}>
            <div onClick={toggleModal} className={styles.background}>
            </div>
            <animated.div className={styles.modal + ' ' + modal_width[size]} style={animation}>
                <div className={styles.modalHeader}>
                    <h1 className={`font-monospace font-bold text-xl`}>{content.title}</h1>
                    <button onClick={toggleModal} className={`text-medium-grey hover:text-light-grey`}>&#10006;</button>
                </div>
                <div className={styles.modalBody}>
                    {content.body}
                </div>
            </animated.div>
        </div>
    );
}

export default Modal;