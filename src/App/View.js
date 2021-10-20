import React, { useEffect } from "react";
import useState from "react-usestateref";
import styled from "styled-components";

import ItemState from "./MerchItem/ItemState.json";
import MerchItem from "./MerchItem/MerchItem";

export default function View() {
    const [ merchItems, setMerchItems ] = useState([
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
    const [ zoomFactor, setZoomFactor, zoomFactorREF ] = useState(1.0);
    const [ viewOrigin, setViewOrigin, viewOriginREF ] = useState({ x: 0, y: 0 })

    const zoomNotch = 0.1;


    useEffect(() => {
        document.addEventListener("wheel", updateZoom);

        return(() => {
            document.removeEventListener("wheel", updateZoom);
        })
    }, []);


        // Update zoom level based on mouse wheel
    const updateZoom = (e) => {
        if( e.deltaY < 0 ) setZoomFactor(zoomFactorREF.current + zoomNotch);
        if( e.deltaY > 0 ) setZoomFactor(zoomFactorREF.current - zoomNotch);
    }

        // Returns current view context
    const getViewContext = () => {
        return (
            {
                zoomFactor: zoomFactor,
                origin: viewOrigin
            }
        )
    }

        // Renders available merch items
    const renderMerchItems = (items) => {
        return(
            items.map((item) => {
                return(
                    <MerchItem
                        itemData={item}
                        viewContext={getViewContext()}
                    />
                )
            })
        );
    }

    return (
        <AppContent>
            { renderMerchItems(merchItems) }
        </AppContent>
    )
}

const AppContent = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 100%;
    height  : 100%;
`;