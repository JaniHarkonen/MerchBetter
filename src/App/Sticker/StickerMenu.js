import React from "react";
import styled from "styled-components";

import DropDownMenu from "../DropDownMenu/DropDownMenu";
import ItemState from "./ItemState.json";

import imgClockface from "../../Assets/img_clockface.svg";
import imgGreenCheck from "../../Assets/img_check_green.svg";
import imgRedCross from "../../Assets/img_cross_red.svg";
import imgOppositeArrows from "../../Assets/img_arrows_opposite.svg";

export default function StickerMenu(props) {
    const options = [
        {
            title: "Open",
            icon: imgClockface,
            state: ItemState.STATE_OPEN,
            onClick: () => {
                props.setState(ItemState.STATE_OPEN);
            }
        },
        {
            title: "Completed",
            icon: imgGreenCheck,
            state: ItemState.STATE_COMPLETED,
            onClick: () => {
                props.setState(ItemState.STATE_COMPLETED);
            }
        },
        {
            title: "Abort",
            icon: imgRedCross,
            state: ItemState.STATE_ABORTED,
            onClick: () => {
                props.setState(ItemState.STATE_ABORTED);
            }
        },
        {
            title: "Reset",
            icon: imgOppositeArrows,
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