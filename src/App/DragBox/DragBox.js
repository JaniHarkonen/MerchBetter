export default class DragBox {
    constructor(settings) {
        let sets = {
            callback: () => { },
            updateInterval: 16,
            gridSize: 1,
            x: 0,
            y: 0,
            ...settings
        };

        this.hostDocument = sets.document;          // Host document to which mouse event listener will be added
        this.beingDragged = false;                  // Whether the element is being dragged
        this.updateCallback = sets.callback;        // Callback function that will be used to update the state of the owner component
        this.updateTimer = Date.now();              // Holds the system time of the latest update
        this.updateInterval = sets.updateInterval;  // Number of milliseconds between updates (default: 16)
        this.gridSize = sets.gridSize;              // Size of the grid to snap the element to (default: 1)

        this.position = {
            x: sets.x,
            y: sets.y,
            xoff: 0,
            yoff: 0
        };

        this.mousePosition = {
            x: 0,
            y: 0
        };

        this.hostDocument.addEventListener("mousemove", this.updatePosition.bind(this));
    }

        // (STATIC) Snaps a coordinate to fit a grid of given size
    static snap(coord, grid) {
        return Math.floor(coord / grid) * grid;
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
        this.position.x = DragBox.snap(x, this.gridSize);
        this.position.y = DragBox.snap(y, this.gridSize);
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