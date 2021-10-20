import React, { useState } from "react";
import styled from "styled-components";

import MerchItem from "../MerchItem/MerchItem";
import ItemState from "../MerchItem/ItemState.json";

export default function ItemList(props) {
    const [ itemCollcetion, setItemCollection ] = useState([
    {
        name: "Nature rune",
        priceInfo: {
            buy: 361,
            sell: 366
        },
        limitInfo: {
            set: (new Date()).toString(),
            quantity: 13000
        },
        state: ItemState.STATE_ABORTED
    }
    ]);

        // Renders a single item listing
    const renderItemListing = (item) => {
        return(
                <MerchItem
                    itemData={item}
                />
        )
    }

        // Renders a list of 
    const renderItemList = () => {
        return(
            itemCollcetion.map((item) => renderItemListing(item))
        );
    }

    return( 
        <Wrapper>
            {renderItemList()}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 100%;
    height  : 100%;
`;