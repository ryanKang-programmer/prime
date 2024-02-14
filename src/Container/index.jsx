import React from "react";
import { Radio } from "react-loader-spinner";
import { Outlet } from "react-router-dom";

const Container = ({style}) => {
    return (
        <div style={style}>
            <Outlet /> 
        </div>
    )
}

export default Container;