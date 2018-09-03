/*
* -= EventManager.ts: =-
* - Extends

* - Changelog:
* - 22/8/18 - Changelog added. <Snowy>
* -=-
*/

namespace com.sideplay.core {
    export class EventManager extends EventEmitter {
        //================================================================================
        // Singleton/Statics:
        //================================================================================
        public static instance: EventEmitter = null;

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * @name            constructor
         * @description     Creates a new instance of EventEmitter
         */
        public constructor() {
            super();

            if (EventManager.instance == null) {
                EventManager.instance = core.events = this;
            } else {
                throw new Error("Cannot make 2 Events. Please use core.Event.instance or core.events instead.");
            }
        }
    }

    // Reference
    export var events: EventManager = null;
}
