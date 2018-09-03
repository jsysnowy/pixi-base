/*
* -= SnowyManager.ts: =-
* - This manager is a new way of handling listeners, inputs etc which should be more efficient.

* - Changelog:
* - 23/08/18 - Created. [Snowy]
* -=-
*/

namespace com.sideplay.core {
    /**
     * This interface stores all params for inputs, such as mouse coords; mouse downs, mouse in canvas etc. etc...
     * @export
     * @interface iInputState
     */
    export interface iInputState {
        mouseX: number;
        mouseY: number;
    }

    /**
     * This interface stores all params for visibility, orientation etc..etc...
     * @export
     * @interface iGameState
     */
    export interface iGameState {}

    export class SnowyManager {
        /**
         * Stores current gameState..
         * @private
         * @type {iGameState}
         * @memberof SnowyManager
         */
        private _gameState: iGameState;

        /**
         *Creates an instance of SnowyManager.
         * @memberof SnowyManager
         */
        public constructor() {
            this._gameState = {};
        }

        /**
         * This call every frame. Checks current values vs stored values and updates.
         * @memberof SnowyManager
         */
        public update() {}
    }
}
