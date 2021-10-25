const fs = window.require("fs");

export default class StateManager {
    constructor(interval) {
        this.outputFile = "state.json";     // File to save the state to
        this.currentState = {};             // State to be saved
        this.saveInterval = interval;       // Duration between saves
        this.saveLoop = null;               // Interval that saves the state periodically
        this.isInitialized = false;         // Whether init() has been called on the manager
    }

        // Creates an interval that saves the state periodically
    init() {
        this.saveLoop = setInterval(() => {
            this.saveState();
        }, this.saveInterval);

        this.isInitialized = true;
    }

        // Clears resources used by the manager
    decommission() {
        clearInterval(this.saveLoop);
    }

        // Saves current state to the output file
    saveState() {
        if( this.outputFile == null || this.outputFile === "" ) return;
        if( this.currentState == null ) return;

        let json_str = JSON.stringify(this.currentState, null, 4);
        fs.writeFileSync(this.outputFile, json_str);
    }

        // Loads the latest saved state from the output file and returns it
    loadState() {
        if( this.outputFile == null || this.outputFile === "" ) return null;
        if( !fs.existsSync(this.outputFile) ) return null;

        let json = JSON.parse(fs.readFileSync(this.outputFile));
        this.currentState = json;

        return json;
    }

        // Returns a reference to the current state
    getState() {
        return this.currentState;
    }

        // Submits changes to the current state by appending it with a given JSON
    submitChanges(json) {
        if( json == null ) return;
        if( this.currentState == null ) return;

        this.currentState = {
            ...this.currentState,
            ...json
        };
    }

        // Removes a field from the state
    removeField(fields) {
        if( fields == null || fields.length <= 0 ) return;
        if( this.currentState == null ) return;

        let json = this.currentState;
        for( let i = 0; i < fields.length - 1; i++ )
        json = json[fields[i]];

        delete json[fields[fields.length - 1]];
    }
}