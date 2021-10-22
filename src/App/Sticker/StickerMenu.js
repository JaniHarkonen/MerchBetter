import React from "react";
import styled from "styled-components";

import DropDownMenu from "../DropDownMenu/DropDownMenu";
import ItemState from "./ItemState.json";

export default function StickerMenu(props) {
    const options = [
        {
            title: "Open",
            state: ItemState.STATE_OPEN,
            onClick: () => {
                props.setState(ItemState.STATE_OPEN);
            }
        },
        {
            title: "Completed",
            state: ItemState.STATE_COMPLETED,
            onClick: () => {
                props.setState(ItemState.STATE_COMPLETED);
            }
        },
        {
            title: "Abort",
            state: ItemState.STATE_ABORTED,
            onClick: () => {
                props.setState(ItemState.STATE_ABORTED);
            }
        },
        {
            title: "Reset",
            state: ItemState.STATE_UNSET,
            onClick: () => {
                props.setState(ItemState.STATE_UNSET);
            }
        }
    ];

        // Returns filtered options with current state removed
    const getFilteredOptions = () => {
        return(options.filter((opt) => opt.state !== props.currentState));
    }

    return(
        <Wrapper>
            <DropDownMenu
                position={props.openAt}
                items={getFilteredOptions()}
            />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    z-index: 5000;
`;