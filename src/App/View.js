import React, { useEffect } from "react";
import useState from "react-usestateref";
import styled from "styled-components";

import ItemState from "./MerchItem/ItemState.json";
import MerchItem from "./MerchItem/MerchItem";
import DropDownMenu from "./DropDownMenu/DropDownMenu";
import KeyManager from "./KeyManager";

let nextStickerId = 100;

    // Returns a unique sticker ID and icrements the counter by one
function getNextStickerId() {
    return nextStickerId++;
}

export default function View() {

    const [ stickers, setStickers, stickersREF ] = useState([]);
    const [ dropDownMenuContent, setDropDownMenuContent ] = useState([
        {
            title: "New sticker",
            onClick: () => {
                closeDropDownMenu();
                addSticker();
            }
        }
    ]);
    const [ zoomFactor, setZoomFactor, zoomFactorREF ] = useState(1.0);
    const [ viewOrigin, setViewOrigin, viewOriginREF ] = useState({ x: 0, y: 0 });
    const [ dropDownMenu, setDropDownMenu ] = useState({
        openAt: {
            x: 0,
            y: 0
        },
        isOpen: false
    });

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

        // Opens the drop down menu upon right click
    const handleMenuOpen = (e) => {
        if( e.button === 2 )
        openDropDownMenu(e.pageX, e.pageY);
        else closeDropDownMenu();
    }

        // Returns a new sticker with default settings
    const makeDefaultSticker = () => {
        let id = getNextStickerId();
        let key = KeyManager.getKey();
        return(
            {
                id: id,
                key: key,
                name: "New item #" + id,
                priceInfo: {
                    buy: "0",
                    sell: "0"
                },
                limitInfo: {
                    set: (new Date()).toString(),
                    quantity: 13000
                },
                state: ItemState.STATE_ABORTED
            }
        );
    }

        // Adds a new merch item sticker to the view
    const addSticker = () => {
        setStickers(stickersREF.current.concat(makeDefaultSticker()));
    }

        // Closes the drop down menu
    const closeDropDownMenu = () => {
        setDropDownMenu({
            ...dropDownMenu,
            isOpen: false
        });
    }

        // Opens the drop down menu at a given location
    const openDropDownMenu = (x, y) => {
        setDropDownMenu({
            openAt: {
                x: x,
                y: y
            },
            isOpen: true
        });
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
    const renderStickers = (items) => {
        return(
            items.map((item) => {
                return(
                    <MerchItem
                        key={item.key}
                        itemData={item}
                        viewContext={getViewContext()}
                    />
                )
            })
        );
    }

    return (
        <AppContent>
            <DropDownMenuArea
                onMouseDown={handleMenuOpen}
            />
            { renderStickers(stickers) }
            {
                dropDownMenu.isOpen &&
                <DropDownMenu
                    position={dropDownMenu.openAt}
                    items   ={dropDownMenuContent}
                />
            }
        </AppContent>
    )
}

const AppContent = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 100%;
    height  : 100%;

    user-select: none;
`;

const DropDownMenuArea = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 100%;
    height  : 100%;
`;