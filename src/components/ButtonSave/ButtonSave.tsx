import React from 'react'
import "./ButtonSave.sass"
import cn from "classnames"

type ButtonSaveType = {
    name: string
    callBack: any
    isLoading: boolean
}

const ButtonSave: React.FC<ButtonSaveType> = (props) => {
    return (
        <button className={cn("button-save", {loading: props.isLoading})} onClick={props.callBack}>{props.name}</button>
    );
};

export default ButtonSave