import React, { useState, useEffect } from "react";
import styled from "styled-components";

import DragBox from "../DragBox/DragBox";

export default function MerchItem(props) {
    const [ position, setPosition ] = useState({ x: 0, y: 0 });
    const [ dragBox, setDragBox ]   = useState(null);
    
    const defaultDimensions = {
        width: 320,
        height: 256
    }

    useEffect(() => {
        let dbox = new DragBox(document, updatePosition, 16);
        setDragBox(dbox);

        return(() => {
            dragBox.decommission();
        });
    }, []);

    const updatePosition = (context) => {
        setPosition({
            x: context.x,
            y: context.y
        });
    }

    const startDragging = () => {
        dragBox.beginDrag();
    }

    const stopDragging = () => {
        dragBox.stopDrag();
    }

    const add = (date) => {
        let d = new Date(Date.parse(date) + 1 * 60 * 60 * 1000);

        return d;
    }

    return(
        <Wrapper
            style={{
                left    : position.x + "px",
                top     : position.y + "px",
                width   : defaultDimensions.width * props.viewContext.zoomFactor,
                height  : defaultDimensions.height * props.viewContext.zoomFactor
            }}
            onMouseDown={startDragging}
            onMouseUp={stopDragging}
        >
            <Title>{props.itemData.name}</Title>
            <PriceInput value={props.itemData.priceInfo.buy} />
            <PriceInput value={props.itemData.priceInfo.sell} />
            GE Limit: {props.itemData.limitInfo.quantity}<br />
            Limit reset: {add(props.itemData.limitInfo.set).getHours()}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: absolute;
    /*width   : 320px;
    height  : 256px;*/
    background-color: gray;
`;

const Title = styled.div`
    position: relative;
    width   : 100%;
    height  : 25%;
    background-color: red;
`;

const PriceInput = styled.input`
    position: relative;
    width   : 44%;
    height  : 32px;

    display     : inline-block;
    margin-left : 2%;
`;