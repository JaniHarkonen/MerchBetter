import React from "react";
import styled from "styled-components";

import { FillElement } from "./FillElement";
import DraggableElement from "../DragBox/DraggableElement";

export default function SubInputField(props) {

    return(
        <Wrapper>
            <DraggableElement
                cbMouseDown={props.callbacks?.startDrag}
                cbMouseUp  ={props.callbacks?.stopDrag}
            />

            <TitleWrapper
                style={{
                    width: props.style?.title?.width || "25%"
                }}
            >
                <Title
                    style={{
                        fontSize: props.style?.title?.fontSize || "16px"
                    }}
                >
                    <DraggableElement
                        cbMouseDown={props.callbacks?.startDrag}
                        cbMouseUp  ={props.callbacks?.stopDrag}
                    />
                    {props.title}
                </Title>
            </TitleWrapper>

            <InputFieldWrapper
                style={{
                    width: props.style?.inputField?.width || "25%"
                }}
            >
                <DraggableElement
                    cbMouseDown={props.callbacks?.startDrag}
                    cbMouseUp  ={props.callbacks?.stopDrag}
                />
                <InputField
                    onFocus ={props.callbacks?.onFocus}
                    onBlur  ={props.callbacks?.onUnFocus}
                    onChange={props.callbacks?.onChange}
                    value   ={props.value}
                    style={{
                        fontSize: props.style?.inputField?.fontSize || "16px"
                    }}
                />
            </InputFieldWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    ${FillElement}

    display     : flex;
    align-items : center;
    user-select: none;
`;

const TitleWrapper = styled.div`
    position: relative;
    height  : 80%;

    display : inline-block;
`;

const Title = styled.div`
    ${FillElement}
`;

const InputFieldWrapper = styled.div`
    position: relative;
    height  : 60%;

    display : inline-block;
`;

const InputField = styled.input`
    ${FillElement}

    margin  : 0;
    padding : 0;
    
    border-style    : none;
    border-radius   : 2px;
    padding-left    : 4px;

    background-color: #E0E0E0;
`;