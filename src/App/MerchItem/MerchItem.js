import React, { useEffect } from "react";
import useState from "react-usestateref";
import styled from "styled-components";

import DragBox from "../DragBox/DragBox";
import DraggableElement from "../DragBox/DraggableElement";
import SubInputField from "../../Common/SubInputField";

export default function MerchItem(props) {
    const [ position, setPosition ]   = useState({ x: 0, y: 0 });           // Position of the sticker
    const [ dragBox, setDragBox, dragBoxREF ] = useState(null);             // DragBox used to drag the sticker upon mouse down
    const [ nameField, setNameField, nameFieldREF ] = useState({});         // Name of the item
    const [ priceFields, setPriceFields ] = useState({});                   // Price field inputs
    
        // Default dimensions of the merch item sticker
    const defaultDimensions = {
        width: 256,
        height: 128
    }

    useEffect(() => {
            // Set DragBox component for dragging
        let dbox = new DragBox({
            document: document,
            callback: updatePosition,
            gridSize: 16
        });
        setDragBox(dbox);

            // Set the name of the item
        setNameField({
            name: props.itemData.name,
            previousName: props.itemData.name,
            isEditing: false
        });

            // Set the prices
        setPriceFields({
            buy: {
                price: props.itemData.priceInfo.buy,
                isEditing: false
            },
            sell: {
                price: props.itemData.priceInfo.sell,
                isEditing: false
            }
        });

            // Handles ENTER press when editing
        document.addEventListener("keydown", handleEnterPress);
        document.addEventListener("mouseup", handleDragEnd);

        return(() => {
            dragBoxREF.current.decommission();
            document.removeEventListener("keydown", handleEnterPress);
            document.removeEventListener("mouseup", handleDragEnd);
        });
    }, []);

        // DragBox calls this to update the state of this merch item
    const updatePosition = (context) => {
        setPosition({
            x: context.x,
            y: context.y
        });
    }

        // Updates the data of editable fields upon ENTER press
    const handleEnterPress = (e) => {
        if( e.code === "Enter" )
        {
            if( checkEditing() )
            unFocusEditFields();
        }
    }

        // Stops dragging upon releasing left mouse button
    const handleDragEnd = (e) => {
        if( e.button === 0 )
        stopDragging();
    }

        // Starts dragging via DragBox
    const startDragging = () => {
        dragBoxREF.current.beginDrag();
    }

        // Stops dragging via DragBox
    const stopDragging = () => {
        dragBoxREF.current.stopDrag();
    }

        // Enables title editing upon double-click on the title
    const handleTitleDoubleClick = (e) => {
        setNameField({
            ...nameField,
            isEditing: true
        });
    }

        // Changes the title to a given one upon editing
    const handleTitleInput = (e) => {
        setNameField({
            ...nameField,
            name: e.target.value
        });
    }

        // Changes the buy price upon editing
    const handleBuyPriceInput = (e) => {
        setPriceFields({
            ...priceFields,
            buy: {
                price: e.target.value,
                isEditing: priceFields.buy.isEditing
            }
        })
    }

        // Changes the sell price upon editing
    const handleSellPriceInput = (e) => {
        setPriceFields({
            ...priceFields,
            sell: {
                price: e.target.value,
                isEditing: priceFields.sell.isEditing
            }
        })
    }

        // Returns whether an editable field is being edited
    const checkEditing = () => {
        return nameFieldREF.current.isEditing;
    }

        // Stops editing all fields
    const unFocusEditFields = () => {
        let nf = nameFieldREF.current;

        setNameField({
            ...nf,
            isEditing: false,
            name: (nf.name === "") ? nf.previousName : nf.name,
            previousName: (nf.name === "") ? nf.previousName : nf.name
        })
    }

        // Selects all text of an input field upon focus
    const selectAllTextUponFocus = (e) => {
        e.target.select();
    }

    const add = (date) => {
        let d = new Date(Date.parse(date) + 1 * 60 * 60 * 1000);

        return d;
    }

    return(
        <Wrapper
            style={{
                left    : position.x * props.viewContext.zoomFactor + "px",
                top     : position.y * props.viewContext.zoomFactor + "px",
                width   : defaultDimensions.width * props.viewContext.zoomFactor,
                height  : defaultDimensions.height * props.viewContext.zoomFactor
            }}
        >
            <DraggableElement
                    cbMouseDown={startDragging}
                    cbMouseUp  ={stopDragging}
            />

            <TitleContainer
            >
                <DraggableElement
                    cbMouseDown={startDragging}
                    cbMouseUp  ={stopDragging}
                />
                <Title
                    onDoubleClick   ={handleTitleDoubleClick}
                    onMouseDown     ={() => {
                                        if( nameField.isEditing === false )
                                        startDragging();
                                    }}
                    onMouseUp       ={stopDragging}
                    style           ={{
                        fontSize: props.viewContext.zoomFactor * 16 + "px"
                    }}
                >
                    {
                        (nameField.isEditing === false)
                        ? nameField.name
                        : <TitleEditField
                            value   ={nameField.name}
                            onChange={handleTitleInput}
                            onFocus ={selectAllTextUponFocus}
                            onBlur  ={unFocusEditFields}
                          />
                    }
                </Title>
            </TitleContainer>

            <PriceInfoContainer>
                <PriceInputFieldContainer
                    style={{
                        height: 32 * props.viewContext.zoomFactor + "px"
                    }}
                >
                    <SubInputField
                        title       ="Buy: "
                        value       ={priceFields.buy?.price}
                        callbacks   ={{
                            onChange: handleBuyPriceInput,
                            startDrag: startDragging,
                            stopDrag: stopDragging
                        }}
                        style       ={{
                            title: { fontSize: props.viewContext.zoomFactor * 16 + "px" },
                            inputField: { fontSize: props.viewContext.zoomFactor * 16 + "px" }
                        }}
                    />
                </PriceInputFieldContainer>

                <PriceInputFieldContainer
                    style={{
                        height: 32 * props.viewContext.zoomFactor + "px"
                    }}
                >
                    <SubInputField
                        title       ="Sell: "
                        value       ={priceFields.sell?.price}
                        callbacks   ={{
                            onChange: handleSellPriceInput,
                            startDrag: startDragging,
                            stopDrag: stopDragging
                        }}
                        style       ={{
                            title: { fontSize: props.viewContext.zoomFactor * 16 + "px" },
                            inputField: { fontSize: props.viewContext.zoomFactor * 16 + "px" }
                        }}
                    />
                </PriceInputFieldContainer>
            </PriceInfoContainer>
            GE Limit: {props.itemData.limitInfo.quantity}<br />
            Limit reset: {add(props.itemData.limitInfo.set).getHours()}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: absolute;

    background-color: gray;
    z-index         : 1;

    border-radius   : 12px;

    &:hover {
        z-index: 1000;
    }
`;

const TitleContainer = styled.div`
    position: relative;
    width   : 100%;
    height  : 20%;

    display         : flex;
    justify-content : center;
    align-items     : center;

    background-color: red;

    border-top-left-radius  : 12px;
    border-top-right-radius : 12px;
`;

const Title = styled.div`
    position: relative;

    &:hover {
        cursor: pointer;
        border-style: dashed;
        border-width: 1px;
    }

    user-select: none;
`;

const TitleEditField = styled.input`
    position: relative;
    width   : auto;

    display         : flex;
    justify-content : center;
`;

const PriceInfoContainer = styled.div`
    position: relative;
    width   : 100%;
    height  : auto;
`;

const PriceInputFieldContainer = styled.div`
    position: relative;
    width   : 100%;
`;