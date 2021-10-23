import React, { useEffect } from "react";
import useState from "react-usestateref";
import styled from "styled-components";

import ItemState from "./Sticker/ItemState.json";
import MerchItem from "./Sticker/Sticker";
import DropDownMenu from "./DropDownMenu/DropDownMenu";
import KeyManager from "./KeyManager";

import imgStickerAdd from "../Assets/img_file_add.svg";
import imgArrowsOpposite from "../Assets/img_arrows_opposite.svg";

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
            icon: imgStickerAdd,
            onClick: () => {
                closeDropDownMenu();
                addSticker();
            }
        },
        {
            title: "Reset stickers",
            icon: imgArrowsOpposite,
            onClick: () => {
                closeDropDownMenu();
                resetAllStickers();
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
                    set: 0,
                    quantity: 13000
                },
                state: ItemState.STATE_UNSET
            }
        );
    }

        // Adds a new merch item sticker to the view
    const addSticker = () => {
        setStickers(stickersREF.current.concat(makeDefaultSticker()));
    }

        // Removes a sticker given its ID
    const removeSticker = (id) => {
        setStickers(stickersREF.current.filter((stk) => stk.id !== id));
    }

        // Sets the state of each sticker to 'unset'
    const resetAllStickers = () => {
        setStickers(stickersREF.current.map((stk) => {
            stk.state = ItemState.STATE_UNSET;
            stk.limitInfo.set = 0;
            return stk;
        }));
    }

        // Sets the state of a given sticker
    const setStickerState = (id, state) => {
        setStickers(stickers.map((stk) => {
            if( stk.id === id )
            stk.state = state;

            return stk;
        }));
    }

        // Sets the limit cooldown timer of a sticker at a certain date
    const setStickerLimitTimer = (id, date) => {
        setStickers(stickers.map((stk) => {
            if( stk.id === id )
            stk.limitInfo.set = date;
            
            return stk;
        }));
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
                        removeId={removeSticker}
                        setStateOfId={setStickerState}
                        setLimitTimerOfId={setStickerLimitTimer}
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
                    items={dropDownMenuContent}
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