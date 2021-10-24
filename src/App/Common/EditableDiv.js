import React from "react";
import styled from "styled-components";

export default function EditableDiv(props) {
    return(
        <Wrapper
            onDoubleClick={props.callbacks?.edit}
            style={props.isEditing ? {
                display: "flex",
            }: {}}
        >
            {
                props.isEditing ?
                <InputField
                    value={props.text}
                    onChange={props.callbacks?.onChange}
                    onFocus={props.callbacks?.onFocus}
                    onBlur={props.callbacks?.onBlur}
                    style={{
                        fontSize: props.style?.inputField?.fontSize
                    }}
                />
                :
                <TextWrapper
                    style={{
                        fontSize: props.style?.text?.fontSize
                    }}
                >
                    {props.text}
                </TextWrapper>
            }
        </Wrapper>
    );
}

const Wrapper = styled.div`
    position: relative;
`;

const TextWrapper = styled.div`
    position: relative;

    &:hover {
        border-style: dashed;
        border-width: 1px;
    }
`;

const InputField = styled.input`
    position: relative;

    padding : 0;
    margin  : 0;
    
    border-style: none;
`;