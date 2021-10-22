import React, { useEffect } from "react";
import useState from "react-usestateref";
import styled from "styled-components";

import DragBox from "../DragBox/DragBox";
import DraggableElement from "../DragBox/DraggableElement";
import SubInputField from "../Common/SubInputField";
import StickerMenu from "./StickerMenu";

import iconRecycleBin from "../../Assets/img_recycle_bin.svg";
import iconCog from "../../Assets/img_cog.svg";
import ItemState from "./ItemState.json";
import EditableDiv from "../Common/EditableDiv";

export default function Sticker(props) {
    const [ position, setPosition ]   = useState({ x: 0, y: 0 });               // Position of the sticker
    const [ dragBox, setDragBox, dragBoxREF ] = useState(null);                 // DragBox used to drag the sticker upon mouse down
    const [ nameField, setNameField, nameFieldREF ] = useState({});             // Name of the item
    const [ priceFields, setPriceFields ] = useState({});                       // Price field inputs
    const [ geLimitField, setGELimitField, geLimitFieldREF ] = useState({});    // GE-limit info of the item
    const [ isSettingsOpen, openSettings ] = useState(false);                   // Whether the settings menu is open
    
        // Default dimensions of the merch item sticker
    const defaultDimensions = {
        width: 264,
        height: 156
    }

        // Default state color lightness values
    const outlineLightness          = "68%";
    const titleBackgroundLightness  = "83%";
    const backgroundLightness       = "91%";

        // Base colors for states
    let stateColorStrings = [];
    stateColorStrings[ItemState.STATE_UNSET / 100]      = "hsl(0, 0%, ";
    stateColorStrings[ItemState.STATE_COMPLETED / 100]  = "hsl(128, 100%, ";
    stateColorStrings[ItemState.STATE_OPEN / 100]       = "hsl(198, 100%, ";
    stateColorStrings[ItemState.STATE_ABORTED / 100]    = "hsl(8, 100%, ";

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

            // Sets the GE limit info of the item
        setGELimitField({
            quantity: props.itemData.limitInfo.quantity,
            setAt: props.itemData.limitInfo.set,
            isEditing: false
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

        // Enables GE quantity limit editing upon double-click on the quantity
    const handleGEQuantityLimitDoubleClick = () => {
        setGELimitField({
            ...geLimitField,
            isEditing: true
        });
    }

        // Changes the GE quantity limit upon editing
    const handleGEQuantityLimitInput = (e) => {
        setGELimitField({
            ...geLimitField,
            quantity: e.target.value
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

        // Removes the sticker upon clicking the trash bin icon
    const handleRemoval = () => {
        props.removeId(props.itemData.id);
    }

        // Toggles the settings drop down menu upon clicking the cog icon
    const handleSettingsOpen = () => {
        openSettings(!isSettingsOpen);
    }

        // Called upon selecting an item from the drop down menu
    const handleDropDownSelection = (state) => {
        /*(state) => {
            openSettings(false);
            props.setStateOfId(props.itemData.id, state);
        }*/

            // Start the cooldown timer when opening a position
        if( state === ItemState.STATE_OPEN )
        {
            let date = new Date();
            props.setLimitTimerOfId(props.itemData.id, date);
            setGELimitField({
                ...geLimitFieldREF.current,
                setAt: date.toString()
            })
        }

        openSettings(false);
        props.setStateOfId(props.itemData.id, state);
    }

        // Returns color of the current state given its lightness
    const getStateColor = (light) => {
        return stateColorStrings[props.itemData.state / 100] + light + ")";
    }

        // Returns the difference between buy and sell price (margin)
    const getPriceMargin = () => {
        return (priceFields?.sell?.price - priceFields?.buy?.price) || 0;
    }

        // Returns whether an editable field is being edited
    const checkEditing = () => {
        return (
            nameFieldREF.current.isEditing ||
            geLimitFieldREF.current.isEditing
        );
    }

        // Stops editing all fields
    const unFocusEditFields = () => {
        let nf = nameFieldREF.current;

        setNameField({
            ...nf,
            isEditing: false,
            name: (nf.name === "") ? nf.previousName : nf.name,
            previousName: (nf.name === "") ? nf.previousName : nf.name
        });

        let ge = geLimitFieldREF.current;

        setGELimitField({
            ...ge,
            isEditing: false
        });
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
                height  : defaultDimensions.height * props.viewContext.zoomFactor,
                
                borderColor: getStateColor(outlineLightness),

                backgroundColor: getStateColor(backgroundLightness)
            }}
        >
            { /* SETTINGS MENU */ }
            {
                isSettingsOpen &&
                <StickerMenu
                    openAt={{
                        x: defaultDimensions.width * 0.9 * props.viewContext.zoomFactor,
                        y: defaultDimensions.height * 0.2 * props.viewContext.zoomFactor
                    }}
                    currentState={props.itemData.state}
                    setState={handleDropDownSelection}
                />
            }
            <DraggableElement cbMouseDown={startDragging} />

            { /* TITLE */ }
            <TitleContainer
                style={{
                    backgroundColor: getStateColor(titleBackgroundLightness),
                    borderBottomColor: getStateColor(outlineLightness)
                }}
                onMouseDown={() => {
                    if( !nameField.isEditing )
                    startDragging();
                }}
            >
                <DraggableElement cbMouseDown={startDragging} />
                <ButtonRemove onClick={handleRemoval}>
                    <FullImage src={iconRecycleBin} />
                </ButtonRemove>
                <ButtonSettings onClick={handleSettingsOpen}>
                    <FullImage src={iconCog} />
                </ButtonSettings>
                <EditableDiv
                    text={nameField.name}
                    isEditing={nameField.isEditing}
                    callbacks={{
                        edit: handleTitleDoubleClick,
                        onChange: handleTitleInput,
                        onFocus: selectAllTextUponFocus,
                        onBlur: unFocusEditFields
                    }}
                    style={{
                        text: { fontSize: props.viewContext.zoomFactor * 16 + "px" },
                        inputField: { fontSize: props.viewContext.zoomFactor * 16 + "px" }
                    }}
                />
            </TitleContainer>

            { /* PRICE INFO */ }
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
                        title="Sell: "
                        value={priceFields.sell?.price}
                        callbacks={{
                            onChange: handleSellPriceInput,
                            startDrag: startDragging,
                            stopDrag: stopDragging
                        }}
                        style={{
                            title: { fontSize: props.viewContext.zoomFactor * 16 + "px" },
                            inputField: { fontSize: props.viewContext.zoomFactor * 16 + "px" }
                        }}
                    />
                </PriceInputFieldContainer>
                <ProfitMaringContainer onMouseDown={startDragging}>
                    <HalfPaneWrapper
                        style={{
                            fontSize: props.viewContext.zoomFactor * 14 + "px",
                            color: (getPriceMargin() > 0) ? "green" : "red"
                        }}
                    >
                        {(getPriceMargin() > 0) ? "+" + getPriceMargin() : getPriceMargin()}
                    </HalfPaneWrapper>
                </ProfitMaringContainer>
            </PriceInfoContainer>

            { /* GE-LIMIT */ }
            <GELimitWrapper
                onMouseDown={() => {
                    if( !geLimitField.isEditing )
                    startDragging();
                }}
            >
                <GEQuantityLimitWrapper>

                    { /* Left-hand side */ }
                    <GEQuantityLimit>
                        <GEQuantityLimitTitle>GE-Limit: </GEQuantityLimitTitle>
                        <GEQuantityLimitAmount>
                            <EditableDiv
                                text={geLimitField.quantity}
                                isEditing={geLimitField.isEditing}
                                callbacks={{
                                    edit: handleGEQuantityLimitDoubleClick,
                                    onChange: handleGEQuantityLimitInput,
                                    onFocus: selectAllTextUponFocus,
                                    onBlur: unFocusEditFields
                                }}
                                style={{
                                    text: { fontSize: props.viewContext.zoomFactor * 14 + "px" },
                                    inputField: { fontSize: props.viewContext.zoomFactor * 14 + "px" }
                                }}
                            />
                        </GEQuantityLimitAmount>
                    </GEQuantityLimit>

                    {/* Right-hand size (using the same styled component) */}
                    <GEQuantityLimitAmount
                        style={{
                            color: (getPriceMargin() > 0) ? "green" : "red"
                        }}
                    >
                        {(getPriceMargin() > 0) ? "+" + getPriceMargin() * geLimitField.quantity : getPriceMargin() * geLimitField.quantity}
                        {geLimitField.setAt}
                    </GEQuantityLimitAmount>
                </GEQuantityLimitWrapper>
            </GELimitWrapper>
            {/*GE Limit: {props.itemData.limitInfo.quantity}<br />*/}
            {/*Limit reset: {add(props.itemData.limitInfo.set).getHours()}*/}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: absolute;

    background-color: white;
    z-index         : 1;

    border-style    : solid;
    border-width    : 1px;
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

    border-bottom-style     : solid;
    border-bottom-width     : 1px;
    border-top-left-radius  : 12px;
    border-top-right-radius : 12px;
`;

const PriceInfoContainer = styled.div`
    position: relative;
    width   : 100%;
    height  : auto;
`;

const PriceInputFieldContainer = styled.div`
    position: relative;
    width   : 48%;
`;

const ProfitMaringContainer = styled.div`
    position: absolute;
    right   : 0px;
    top     : 0px;
    width   : 48%;
    height  : 100%;
`;

const HalfPaneWrapper = styled.div`
    position: absolute;
    left    : 0px;
    bottom  : 0px;
    width   : 100%;
    height  : 50%;

    display     : flex;
    align-items : center;

    font-weight: bold;
`;

const TitleBarButton = styled.div`
    position: absolute;
    top     : transform(translateY(-50%));
    width   : 6%;
    height  : 75%;

    border-radius: 4px;

    cursor: pointer;

    &:hover {
        background-color: rgba(0, 0, 0, 0.3);
    }
`;

const ButtonRemove = styled(TitleBarButton)`
    left: 3.5%;
`;

const ButtonSettings = styled(TitleBarButton)`
    right: 3.5%;
`;

const FullImage = styled.img`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 100%;
    height  : 100%;
`;

const GELimitWrapper = styled.div`
    position: relative;
    width   : 100%;
    height  : 30%;
`;

const GEQuantityLimitWrapper = styled.div`
    position: relative;
    width   : 100%;
    height  : 50%;
`;

const GEQuantityLimit = styled.div`
    position: relative;
    width   : 50%;
    height  : 100%;
`;

const GEQuantityLimitTitle = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 50%;
    height  : 100%;
`;

const GEQuantityLimitAmount = styled.div`
    position: absolute;
    right   : 0px;
    top     : 0px;
    width   : 50%;
    height  : 100%;

    display     : flex;
    align-items : center;

    font-weight: bold;
`;