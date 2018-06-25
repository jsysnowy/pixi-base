/*
* -= VariableWatcher.ts: =-
* - This class can be passed in any variables, and it will trigger a function whenever any of them change.

* - Changelog:
* - 04/06/18 - Created and logic implemented. [Snowy]
* -=-
*/

namespace com.sideplay.helper.tools {
    export class VariableWatcher {
        //================================================================================
        // Class Field:
        //================================================================================
        private _storedValues: any[];
        private _lastKnownValues: any[];
        private _onChangeFunc: () => any;
        private _isFunction: boolean;
        private _functionObj: () => any;
        //================================================================================
        // Constructor:
        //================================================================================

        /**
         *Creates an instance of VariableWatcher.
         * @param {(any|any[])} inputs
         * @param {()=>any} onChange
         * @memberof VariableWatcher
         */
        public constructor(inputs: any | any[], onChange: () => any) {
            // Store current values:
            if (Array.isArray(inputs)) {
                // Clone lastKnownValues..
                this._storedValues = inputs;
                this._lastKnownValues = inputs.slice(0);
                this._isFunction = false;
            } else {
                if (typeof inputs == "function") {
                    this._isFunction = true;
                    this._functionObj = inputs;
                    this._storedValues = [inputs()];
                    this._lastKnownValues = [inputs()].slice(0);
                } else {
                    // Add to array and clone
                    this._storedValues = [inputs];
                    this._lastKnownValues = [inputs].slice(0);
                    this._isFunction = false;
                }
            }

            this._onChangeFunc = onChange;

            // Create game function which will check if anything changes, and will call onChange if it does:
            core.game.addUpdateFunction(this._checkForChanges.bind(this));
        }

        /**
         * Call this to destroy this VariableWatcher.
         * @memberof VariableWatcher
         */
        public destroy(): void {
            core.game.removeUpdateFunction(this._checkForChanges.bind(this));
            this._storedValues = null;
            this._lastKnownValues = null;
            this._onChangeFunc = null;
        }

        //================================================================================
        // Private Functions:
        //================================================================================

        /**
         * Checks to see if any values changed, will update and call if they did.
         * @private
         * @memberof VariableWatcher
         */
        private _checkForChanges(): void {
            // If it is a function, re-call it:
            if (this._isFunction) {
                this._storedValues = [this._functionObj()];
            }

            // Make sure values match..
            if (!helper.arrays.compare(this._storedValues, this._lastKnownValues)) {
                // Something changed here! Update and call function
                this._lastKnownValues = this._storedValues;
                this._onChangeFunc();
            }
        }
    }
}
