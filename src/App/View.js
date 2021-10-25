import React, { useEffect } from "react";
import useState from "react-usestateref";
import styled from "styled-components";

import ItemState from "./Sticker/ItemState.json";
import MerchItem from "./Sticker/Sticker";
import DropDownMenu from "./DropDownMenu/DropDownMenu";
import KeyManager from "./KeyManager";
import DragBox from "./DragBox/DragBox";
import StateManager from "./StateManager";

import imgStickerAdd from "../Assets/img_file_add.svg";
import imgArrowsOpposite from "../Assets/img_arrows_opposite.svg";
import imgMagGlass from "../Assets/img_mag_glass.svg";

let nextStickerId = 100;

    // Returns a unique sticker ID and icrements the counter by one
function getNextStickerId() {
    return nextStickerId++;
}

export default function View() {

    const [ stateManager, setStateManager, stateManagerREF ] = useState(null);
    const [ viewPanner, setViewPanner, viewPannerREF ] = useState(null);
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
        },
        {
            title: "Reset zoom",
            icon: imgMagGlass,
            onClick: () => {
                closeDropDownMenu();
                setZoomFactor(1.0);
                submitChangesZoom(1.0);
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
        setViewPanner(new DragBox({
            document: document,
            callback: updateViewPosition,
            gridSize: 16
        }));

        let sm = new StateManager(1000);
        sm.init();

            // If a state file doesn't exist, create it
        if( sm.loadState() === null )
        {
            sm.submitChanges({
                view: {
                    ...getViewContext(),
                    nextStickerId: nextStickerId
                },
                stickers: {}
            });
        }
        else
        {
            sm.loadState();

                // Load stickers
            let stkrs_json = sm.getState().stickers;
            let stkrs_arr = [];
            for( let key of Object.keys(stkrs_json) )
            {
                let stkr = stkrs_json[key];
                stkrs_arr.push({
                    id: key,
                    ...stkr,
                    key: KeyManager.getKey()
                });
            }

                // Load view context
            setViewContext({
                ...sm.getState().view,
                stateManager: sm
            });
            nextStickerId = sm.getState().view.nextStickerId;

            setStickers(stkrs_arr);
        }

        setStateManager(sm);

        document.addEventListener("wheel", updateZoom);

        return(() => {
            document.removeEventListener("wheel", updateZoom);
            sm.decommission();
        })
    }, []);


        // Update zoom level based on mouse wheel
    const updateZoom = (e) => {
        let newzoom = zoomFactorREF.current - (Math.sign(e.deltaY) * zoomNotch);

        setZoomFactor(newzoom);
        submitChangesZoom(newzoom);
    }

        // Submits changes to the zoom factor
    const submitChangesZoom = (zoom) => {
        stateManagerREF.current.submitChanges({
            view: {
                ...stateManagerREF.current.getState().view,
                zoomFactor: zoom
            }
        });
    }

        // Updates the position of the view upon panning
    const updateViewPosition = (context) => {
        setViewOrigin({
            x: context.x,
            y: context.y
        });
    }

        // Opens the drop down menu upon right click
    const handleMenuOpen = (e) => {
        if( e.button === 2 )
        openDropDownMenu(e.pageX, e.pageY);
        else
        {
            if( e.button === 0 && e.shiftKey === true )
            startDragging(e);

            closeDropDownMenu();
        }
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
                    quantity: 0
                },
                state: ItemState.STATE_UNSET,
                position: {
                    x: 0,
                    y: 0
                }
            }
        );
    }

        // Adds a new merch item sticker to the view
    const addSticker = () => {
        setStickers(stickersREF.current.concat(makeDefaultSticker()));
        stateManagerREF.current.submitChanges({
            view: {
                ...stateManagerREF.current.getState().view,
                nextStickerId: nextStickerId
            }
        });
    }

        // Removes a sticker given its ID
    const removeSticker = (id) => {
        setStickers(stickersREF.current.filter((stk) => stk.id !== id));
        stateManagerREF.current.removeField(["stickers", "" + id]);
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

        // Starts dragging the view upon SPACE + mouse press
    const startDragging = () => {
        viewPannerREF.current.beginDrag();
    }

        // Stops dragging the view
    const stopDragging = () => {
        viewPannerREF.current.stopDrag();
    }

        // Returns current view context
    const getViewContext = () => {
        return (
            {
                zoomFactor: zoomFactorREF.current,
                origin: viewOriginREF.current,
                stateManager: stateManagerREF.current
            }
        )
    }

        // Sets the view context
    const setViewContext = (context) => {
        setZoomFactor(context.zoomFactor);
        setViewOrigin(context.origin);
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
                        getStateManager={() => {
                            return getViewContext().stateManager
                        }}
                    />
                )
            })
        );
    }

    return (
        <AppContent
        onMouseUp={stopDragging}
        >
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
            Right-click to place a sticker.
        </AppContent>
    )
}

const AppContent = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 100%;
    height  : 100%;

    display         : flex;
    justify-content : center;
    align-items     : center;
    overflow        : hidden;

    color       : rgba(0, 0, 0, 0.25);
    font-weight : bold;
    font-size   : 48px;

    user-select: none;
`;

const DropDownMenuArea = styled.div`
    position: absolute;
    left    : 0px;
    top     : 0px;
    width   : 100%;
    height  : 100%;
`;