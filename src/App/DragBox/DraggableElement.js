import React from "react";
import styled from "styled-components";

export default function DraggableElement(props) {

        // Called upon mouse down
        // NOTICE: Mouse release should be handled by the parent component
        // as it requires event listeners for better performance!
    const handleMouseDown = () => {
        props.cbMouseDown();
    }

    return(
        <Element
            onMouseDown={handleMouseDown}
        />
    )
}

const Element = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 100%;
    height  : 100%;
`;