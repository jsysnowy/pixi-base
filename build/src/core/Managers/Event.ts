namespace com.sideplay.core {
    export class Events extends EventEmitter {
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

            if (Events.instance == null) {
                Events.instance = core.events = this;
            } else {
                throw new Error("Cannot make 2 Events. Please use core.Event.instance or core.events instead.");
            }
        }
    }

    // Reference
    export var events: Events = null;
}
