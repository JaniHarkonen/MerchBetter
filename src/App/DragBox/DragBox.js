export default class DragBox {
    constructor(doc, callback = () => {}, upd_inval = 16) {
        this.hostDocument = doc;            // Host document to which mouse event listener will be added
        this.beingDragged = false;          // Whether the element is being dragged
        this.updateCallback = callback;     // Callback function that will be used to update the state of the owner component
        this.updateTimer = Date.now();      // Holds the system time of the latest update
        this.updateInterval = upd_inval;    // Number of milliseconds between updates (default: 16)

        this.position = {
            x: 0,
            y: 0,
            xoff: 0,
            yoff: 0
        };

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.hostDocument.addEventListener("mousemove", this.updatePosition.bind(this));
    }
    
        // Updates the position of the element in the event listener
    updatePosition(e) {
        this.mousePosition.x = e.pageX;
        this.mousePosition.y = e.pageY;

        if( this.beingDragged === false ) return;

        this.setPosition(e.pageX + this.position.xoff, e.pageY + this.position.yoff);

            // Update host component and pass it the relevant context
        if( Date.now() - this.updateTimer >= this.updateInterval )
        {
            this.updateTimer = Date.now();
            
            this.updateCallback({
                x: this.position.x,
                y: this.position.y
            });
        }
    }

        // Sets the position of the element
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

        // Returns a copy of the element's position
    getPosition() {
        return {
            x: this.position.x,
            y: this.position.y
        }
    }

        // Begins dragging
    beginDrag() {
        this.position.xoff = this.position.x - this.mousePosition.x;
        this.position.yoff = this.position.y - this.mousePosition.y;

        this.beingDragged = true;
    }

        // Stops dragging
    stopDrag() {
        this.beingDragged = false;
    }

        // Returns whether the element is being dragged
    isDragged() {
        return this.beingDragged;
    }

        // Decommissions the drag box
    decommission() {
        this.hostDocument.removeEventListener("mousemove", this.updatePosition);
    }
}