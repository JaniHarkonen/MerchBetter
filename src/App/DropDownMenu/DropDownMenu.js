import React from "react";
import styled from "styled-components";

import KeyManager from "../KeyManager";

export default function DropDownMenu(props) {
    const defaultWidth = 128;

        // Renders list selection elements
    const renderListings = () => {
        if( props == null ) return "";

        return(
            props.items.map((item) => {
                return(
                    <ListSelection
                        key={KeyManager.getKey()}
                        onClick={item.onClick}
                    >
                        { item.title }
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

    display         : flex;
    justify-content : center;
    align-items     : center;

    background-color: red;
    cursor          : pointer;

    &:hover {
        background-color: blue;
    }
`;