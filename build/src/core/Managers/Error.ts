namespace com.sideplay.core {
    export class ErrorManager {
        //================================================================================
        // Customisable Class Params:
        //================================================================================

        //================================================================================
        // Non-Customisable Class Params:
        //================================================================================
        public static instance: ErrorManager = null;
        private _displayedErrors: number = 0;

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * Creates an instance of ErrorManager.
         * @memberof ErrorManager
         */
        public constructor() {
            if (ErrorManager.instance === null) {
                ErrorManager.instance = core.error = this;

                window.addEventListener("error", (evt: ErrorEvent) => {
                    this.onError(evt);
                });
            } else {
                throw new Error("An unexpected error occured whilst initialising core files.");
            }
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * Called whenever there is an error - this will trigger, it creates that white error box at top-left.
         * @param {ErrorEvent} errorEvent
         * @memberof ErrorManager
         */
        public onError(errorEvent: ErrorEvent) {
            // Game set to be an error...
            debug.fsm.setState(debug.States.gameError);

            const errorDiv = document.createElement("div");
            errorDiv.id = "errorPanel";
            errorDiv.style.position = "absolute";
            errorDiv.style.backgroundColor = "#FFFFFF";
            errorDiv.style.top = this._displayedErrors + "px";
            this._displayedErrors += 18;
            const parentDiv = document.getElementById("gameArea");

            parentDiv.appendChild(errorDiv);
            errorDiv.innerHTML = errorEvent.message + "\n. LN: " + errorEvent.lineno + ", Col: " + errorEvent.colno + ".";
        }
    }

    // Reference
    export let error: ErrorManager = null;
}
