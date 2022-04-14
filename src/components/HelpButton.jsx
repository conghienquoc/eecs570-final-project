import React, { useState } from "react";
import {ReactComponent as HelpIcon} from "../icons/question.svg"

const HelpButton = ({toggleModal}) => {
    return (
        <div className="flex items-center">
            <button onClick={toggleModal}>
                <HelpIcon className="w-[20px] h-[20px] fill-medium-grey hover:fill-offblack"/>
            </button>
        </div>
    )
}

export default HelpButton;