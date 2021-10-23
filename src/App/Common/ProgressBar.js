import React from "react";
import styled from "styled-components";

import { FillElement } from "./FillElement";

export default function ProgressBar(props) {
    return(
        <Wrapper>
            <Bar
                style={{
                    left: "0px",
                    width: Math.round(props.value?.current / props.value?.max * 100) +"%",
                    backgroundColor: props.color?.finished
                }}
            />
            <Bar
                style={{
                    right: "0px",
                    width: Math.round((1 - props.value?.current / props.value?.max) * 100) +"%",
                    backgroundColor: props.color?.left
                }}
            />
            <TitleWrapper style={{
                    fontSize: props.style?.title?.fontSize,
                    color: props.style?.title?.fontColor
                }}
            >
                {props.title}
            </TitleWrapper>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    ${FillElement}
`;

const Bar = styled.div`
    position: absolute;
    top     : 0px;
    height  : 100%;
`;

const TitleWrapper = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 100%;
    height  : 100%;

    display         : flex;
    justify-content : center;
    align-items     : center;
`;