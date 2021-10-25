import React from "react";
import styled from "styled-components";

import KeyManager from "../KeyManager";

export default function DropDownMenu(props) {
    const defaultWidth = 128;

        // Renders list selection elements
    const renderListings = () => {
        if( props == null ) return "";

        return(
            props.items.map((item, index) => {
                return(
                    <ListSelection
                        key={KeyManager.getKey()}
                        onClick={item.onClick}
                        style={{
                            borderBottomStyle: (index < props.items.length - 1) ? "dashed" : "none",
                            borderBottomWidth: "1px",
                            borderBottomColor: "#CECECE"
                        }}
                    >
                        {
                            item.icon ?
                            <>
                                <IconWrapper
                                    style={{
                                        width: props.style?.splitX || "25%"
                                    }}
                                >
                                    <IconImage src={item.icon} />
                                </IconWrapper>
                                <TitleWrapper
                                    style={{
                                        width: `calc(100% - ${props.style?.splitX || "25%"})`
                                    }}
                                >
                                    { item.title}
                                </TitleWrapper>
                            </>
                            :
                            <TitleWrapper
                                style={{
                                    width: "100%",
                                    justifyContent: "center"
                                }}
                            >
                                { item.title }
                            </TitleWrapper>
                        }
                    </ListSelection>
                )
            })
        );
    }

    return(
        <Wrapper
            style={{
                left: props.position?.x + "px",
                top: props.position?.y + "px",
                width: (props.width || defaultWidth) + "px"
            }}
        >
            <ListWrapper>
                { renderListings() }
            </ListWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: absolute;

    border-style    : solid;
    border-width    : 1px;
    border-radius   : 8px;
    border-color    : #BCBCBC;

    background-color: white;
    overflow        : hidden;
    color           : black;
    font-weight     : normal;

    z-index : 5000;
`;

const ListWrapper = styled.div`
    position: relative;
    width   : 100%;
    height  : auto;
`;

const ListSelection = styled.div`
    position: relative;
    width   : 100%;
    height  : 32px;

    cursor          : pointer;

    &:hover {
        background-color: #EFEFEF;
    }
`;

const IconWrapper = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    height  : 100%;

    display         : flex;
    justify-content : center;
    align-items     : center;
`;

const TitleWrapper = styled.div`
    position: absolute;
    right   : 0px;
    top     : 0px;
    height  : 100%;

    display     : flex;
    align-items : center;

    font-size: 14px;
`;

const IconImage = styled.img`
    position: relative;
    left    : 0px;
    top     : 0px;
    width   : 65%;
    height  : 65%;
`;