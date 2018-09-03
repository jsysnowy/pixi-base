/*
* -= Listeners.ts: =-
* - Sets up and stores all listeners the game uses when reacting to various events happening on the page.
* - Sideplay core framework file.

* - Changelog:
* - 14/4/18 - Created and logic implemented. [Snowy]
* - 16/4/18 - Fixed type where orientationChange was calling focusLoss listeners. [Snowy]
* - 16/4/18 - Added function to manually trigger listeners. [Snowy]
* - 05/06/18 - Added new Interaction for click and tap [Snowy]
* -=-
*/

namespace com.sideplay.core {
    export class Listeners {
        //#region Singletons
        public static instance: Listeners;
        //#endregion

        //#region Accessible names of all states
        /**
         * Listener which triggers whenever the visibility state on the game changes.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static visibilityChange: string = "visibilityChange";

        /**
         * Listener which triggers whenever the visibility on the game is lost.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static visibilityLost: string = "visibilityLost";

        /**
         * Listener which triggers whenever the visibility on the game is gained.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static visibilityGained: string = "visibilityGained";

        /**
         * Listener which triggers whenever the games focus is changed.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static focusChange: string = "focusChange";

        /**
         * Listener which triggers when the focus on the game is lost.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static focusLost: string = "focusLost";

        /**
         * Listener which triggers when the focus on the game is gained.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static focusGained: string = "focusGained";

        /**
         * Listener which triggers when the game is resized.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static resize: string = "resize";

        /**
         * Listener which triggers when the games orientation is changed.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static orientationChange: string = "orientationChange";

        /**
         * Listener which triggers when the games orientation is changed to an invalid orientation.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static orientationInvalid: string = "orientationInvalid";

        /**
         * Listener which triggers when the games orientation is changed to a valid orientation.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static orientationValid: string = "orientationValid";

        /**
         * Listener which triggers on any interaction with the game.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static interaction: string = "interaction";

        /**
         * Listener which triggers when the user tries to scroll the game.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static scroll: string = "scroll";

        /**
         * Listener which calls when the user moves their touch.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static touchMove: string = "touchMove";

        /**
         * Listener which calls when the user stops touching.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static touchEnd: string = "touchEnd";

        /**
         * Listener which calls when mouse exits the games canvas.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static mouseLeaveCanvas: string = "canvasLeave";

        /**
         * Listener which calls when mouse enters the games canvas.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static mouseEnterCanvas: string = "canvasEnter";

        /**
         * Listener which calls when user holds down a mouse button.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static pointerDown: string = "pointerDown";

        /**
         * Listener which calls when used releases a held mouse button.
         * @static
         * @type {string}
         * @memberof Listeners
         */
        public static pointerUp: string = "pointerUp";
        //#endregion

        //#region Class properties:
        private _initialised: boolean = false;
        private _functionsLib: { type: string; func: any; params: any[] }[];
        private _isCorrectOrientation: boolean;
        private _isVisible: boolean;
        private _isFocused: boolean;

        // - Current states to make sure triggers don't fire multiple times.
        private _interaction: boolean;
        private _numCursors: number;
        private _focused: boolean;
        private _visible: boolean;
        //#endregion

        // Variable listeners:

        //================================================================================
        // Getters/Setters:
        //================================================================================

        /**
         * Returns the current value of isVisible.
         * @readonly
         * @type {boolean}
         * @memberof Listeners
         */
        public get isVisible(): boolean {
            if (!this._initialised) {
                throw new Error("Cannot return state of visible whilst not initialised.");
            }

            return this._isVisible;
        }
        // Don't use this unless you NEED to - ie: if you're not pauseIcon, then don't use this.
        public set isVisible(value: boolean) {
            if (!this._initialised) {
                throw new Error("Cannot set state of visible whilst not initialised.");
            }

            this._isVisible = value;
        }

        /**
         * Returns the current value of isFocused.
         * @readonly
         * @type {boolean}
         * @memberof Listeners
         */
        public get isFocused(): boolean {
            if (!this._initialised) {
                throw new Error("Cannot return state of focus whilst not initialised.");
            }

            return this._isFocused;
        }

        /**
         * Returns the current value of isCorrectOrientation.
         * @readonly
         * @type {boolean}
         * @memberof Listeners
         */
        public get isCorrectOrientation(): boolean {
            if (!this._initialised) {
                throw new Error("Cannot return state of orientation whilst not initialised.");
            }
            return this._isCorrectOrientation;
        }

        //================================================================================
        // Constructor
        //================================================================================

        /**
         * Creates an instance of Listeners.
         * @memberof Listeners
         */
        public constructor() {
            if (Listeners.instance == null) {
                // Initialises the singleton
                Listeners.instance = core.listeners = this;
                // Initialise the library array used for handling
                this._functionsLib = [];
            } else {
                throw new Error("Cannot create two instances of Listeners..  Please use Listeners.instance or core.listeners instead");
            }
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * Adds a function which is tied to a listener.
         * @param {string} type
         * @param {*} func
         * @param {...any[]} params
         * @memberof Listeners
         */
        public add(type: string | string[], func: any, ...params: any[]): void {
            // Make sure this doesn't already exist.
            let listener = this._findListenerInLibArr(func);

            if (listener == null) {
                // The function didn't exist, we need to make a new listener.
                if (Array.isArray(type)) {
                    type = type.join(",");
                }

                // Adds this function to the library of listeners.
                this._functionsLib.push({ type: type, func: func, params: params });
            } else {
                // The function already exists as a listener, we need to edit it instead.
                this._editListenerTypeOnFunction(listener, type);
            }
        }

        /**
         * Removes a function which is currently tied to to a listener.
         * @param {string} type
         * @param {*} func
         * @memberof Listeners
         */
        public remove(type: string | string[], func: any): boolean {
            // Find the listener
            let listener = this._findListenerInLibArr(func);

            // Make sure listeners exists - else return null.
            if (listener == null) {
                if (config.settings.developerMode) {
                    console.error("Tried to remove a listener from listeners.ts and couldn't find it.");
                }
                return false;
            }

            // If types match exactly, it gets completely removed:
            if (type == listener.type) {
                this._removeListenerFromLibArr(listener);
            } else {
                // Type didn't match.. just remove types specified:
                let a1: string[];
                if (!Array.isArray(type)) {
                    a1 = type.split(",");
                } else {
                    a1 = helper.arrays.clone(type);
                }
                let a2: string[] = listener.type.split(",");

                // Loop through each type specified to be removed.
                a1.forEach(tR => {
                    // Loop through each type currently on the listener.
                    a2.forEach(tL => {
                        // If they match,remove it.
                        if (tR == tL) {
                            a2.splice(a2.indexOf(tR), 1);
                        }
                    });
                });

                // If a2 is empty now, remove the listener, else - set a2 as new type for listener.
                if (a2.length == 0) {
                    this._removeListenerFromLibArr(listener);
                } else {
                    this._editListenerTypeOnFunction(listener, a2);
                }
            }
        }

        /**
         * We use this to manually fire a listener which is tied to the page, can be useful for testing/edge cases.
         * @param {string} type
         * @memberof Listeners
         */
        public manuallyFireListener(type: string) {
            for (let i = 0; i < this._functionsLib.length; i++) {
                if (this._checkIfListenersHasType(Listeners[type], this._functionsLib[i])) {
                    this._functionsLib[i].func(...this._functionsLib[i].params);
                }
            }
        }

        /**
         * Initialises all listeners.
         * @memberof Listeners
         */
        public init(): void {
            this._initialiseListeners();
        }

        /**
         * Called every frame, this checks listeners states incase it needs to fire any.
         * @memberof Listeners
         */
        public update(): void {}

        //================================================================================
        // Private Functions:
        //================================================================================

        /**
         * Called to initialise all listeners on the page, dependant on
         * @private
         * @memberof Listeners
         */
        private _initialiseListeners(): void {
            // Make sure not already initialised
            if (this._initialised) {
                return;
            }

            // Visibility Listeners:
            var browserPrefixes = ["moz", "ms", "o", "webkit"],
                isVisible = true; // internal flag, defaults to true

            // Assuming it's visible.
            this._isVisible = true;

            // get the correct attribute name
            function getHiddenPropertyName(prefix) {
                return prefix ? prefix + "Hidden" : "hidden";
            }

            // get the correct event name
            function getVisibilityEvent(prefix) {
                return (prefix ? prefix : "") + "visibilitychange";
            }

            // get current browser vendor prefix
            function getBrowserPrefix() {
                for (var i = 0; i < browserPrefixes.length; i++) {
                    if (getHiddenPropertyName(browserPrefixes[i]) in document) {
                        // return vendor prefix
                        return browserPrefixes[i];
                    }
                }

                // no vendor prefix needed
                return null;
            }

            // bind and handle events
            var browserPrefix = getBrowserPrefix(),
                hiddenPropertyName = getHiddenPropertyName(browserPrefix),
                visibilityEventName = getVisibilityEvent(browserPrefix);

            let onVisible = () => {
                // prevent double execution
                if (isVisible) {
                    return;
                }

                // change flag value
                isVisible = true;
                this._isVisible = true;
                this._onVisibilityChange();
            };

            let onHidden = () => {
                // prevent double execution
                if (!isVisible) {
                    return;
                }

                // change flag value
                isVisible = false;
                this._isVisible = false;
                this._onVisibilityChange();
            };

            function handleVisibilityChange(forcedFlag) {
                // forcedFlag is a boolean when this event handler is triggered by a
                // focus or blur event otherwise it's an Event object
                if (typeof forcedFlag === "boolean") {
                    if (forcedFlag) {
                        return onVisible();
                    }

                    return onHidden();
                }

                if (document[hiddenPropertyName]) {
                    return onHidden();
                }

                return onVisible();
            }

            document.addEventListener(visibilityEventName, handleVisibilityChange, false);

            // Focus Listeners:
            this._isFocused = document.hasFocus();

            window.addEventListener("focus", () => {
                this._isFocused = true;
                this._onFocusChange();
            });

            window.addEventListener("blur", () => {
                this._isFocused = false;
                this._onFocusChange();
            });

            // Resize Listeners:
            window.addEventListener("resize", () => {
                this._onResize();
            });

            // Orientation Listeners:
            // Detect whether or not in correct orientation:
            if (window.innerHeight > window.innerWidth) {
                if (config.settings.correctOrientation == "landscape") {
                    this._isCorrectOrientation = false;
                } else if (config.settings.correctOrientation == "portrait") {
                    this._isCorrectOrientation = true;
                }
            } else {
                if (config.settings.correctOrientation == "landscape") {
                    this._isCorrectOrientation = true;
                } else if (config.settings.correctOrientation == "portrait") {
                    this._isCorrectOrientation = false;
                }
            }

            window.addEventListener("orientationchange", () => {
                this._onOrientationChange();
            });

            // Interaction Listeners:
            core.game.renderer.view.addEventListener(Interaction.pointerdown, () => {
                this._onInteraction();
            });

            document.addEventListener("click", () => {
                this._onInteraction();
            });

            document.addEventListener("tap", () => {
                this._onInteraction();
            });

            // Scroll Listeners:
            window.addEventListener("scroll", () => {
                this._onScroll();
            });

            // Touch Listeners:
            window.addEventListener("touchmove", () => {
                this._onTouchMove();
            });
            window.addEventListener("touchend", () => {
                this._onTouchEnd();
            });

            // Set initialised flag
            this._initialised = true;
        }

        /**
         * Finds and returns any listeners which already have the function passed in as a parameter. Stops duplicate functions existing.
         * @private
         * @param {*} func
         * @returns {*}
         * @memberof Listeners
         */
        private _findListenerInLibArr(func: any): any {
            // Loop over libArr.
            for (let i = 0; i < this._functionsLib.length; i++) {
                // If it finds the function, return it.
                if (this._functionsLib[i].func == func) {
                    return this._functionsLib[i];
                }
            }

            // Return null if it didn't find it.
            return null;
        }

        /**
         * Checks if a listener has a certain type, returns true or false depending on outcome.
         * @private
         * @param {string} type
         * @param {*} listener
         * @returns {boolean}
         * @memberof Listeners
         */
        private _checkIfListenersHasType(type: string, listener: any): boolean {
            // Split types into array
            let typesArr = listener.type.split(",");

            // Check if indexOf type is not -1.  If it isn't -1 then the listener has the type.
            if (typesArr.indexOf(type) != -1) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Edit the type of an already existing listener and return it.
         * @private
         * @param {*} oldListener
         * @param {(string | string[])} newType
         * @returns {*}
         * @memberof Listeners
         */
        private _editListenerTypeOnFunction(oldListener: any, newType: string | string[]): any {
            // Join array with comma's if it's a string.
            if (Array.isArray(newType)) {
                newType = newType.join(",");
            }

            // Set new listener type and return it
            oldListener.type = newType;
            return oldListener;
        }

        /**
         * Removes a listener from the library array completely.
         * @private
         * @param {*} listener
         * @returns {boolean}
         * @memberof Listeners
         */
        private _removeListenerFromLibArr(listener: any): boolean {
            return this._functionsLib.splice(this._functionsLib.indexOf(listener), 1) != null;
        }

        /**
         * Called when visibility state is changed.
         * @private
         * @memberof Listeners
         */
        private _onVisibilityChange(): void {
            // Call any functions which have visibilityChange type:
            for (let i = 0; i < this._functionsLib.length; i++) {
                if (this._checkIfListenersHasType(Listeners.visibilityChange, this._functionsLib[i])) {
                    this._functionsLib[i].func(...this._functionsLib[i].params);
                }
            }

            // If visibility was lost, call any functions which have visibilityLost type:
            if (!this._isVisible) {
                for (let i = 0; i < this._functionsLib.length; i++) {
                    if (this._checkIfListenersHasType(Listeners.visibilityLost, this._functionsLib[i])) {
                        this._functionsLib[i].func(...this._functionsLib[i].params);
                    }
                }
            }

            // If visibility was gained, call any functions which have visibilityGain type:
            if (this._isVisible) {
                for (let i = 0; i < this._functionsLib.length; i++) {
                    if (this._checkIfListenersHasType(Listeners.visibilityGained, this._functionsLib[i])) {
                        this._functionsLib[i].func(...this._functionsLib[i].params);
                    }
                }
            }
        }

        /**
         * Called when focus on page is changed.
         * @private
         * @memberof Listeners
         */
        private _onFocusChange(): void {
            // Call any functions which have focusChange type:
            for (let i = 0; i < this._functionsLib.length; i++) {
                if (this._checkIfListenersHasType(Listeners.focusChange, this._functionsLib[i])) {
                    this._functionsLib[i].func(...this._functionsLib[i].params);
                }
            }

            // If visibility was lost, call any functions which have focusLost type:
            if (!this._isFocused) {
                for (let i = 0; i < this._functionsLib.length; i++) {
                    if (this._checkIfListenersHasType(Listeners.focusLost, this._functionsLib[i])) {
                        this._functionsLib[i].func(...this._functionsLib[i].params);
                    }
                }
            }

            // If visibility was gained, call any functions which have focusGained type:
            if (this._isFocused) {
                for (let i = 0; i < this._functionsLib.length; i++) {
                    if (this._checkIfListenersHasType(Listeners.focusGained, this._functionsLib[i])) {
                        this._functionsLib[i].func(...this._functionsLib[i].params);
                    }
                }
            }
        }

        /**
         * Called when the page is resized.
         * @private
         * @memberof Listeners
         */
        private _onResize(): void {
            // Detect whether or not in correct orientation:
            if (window.innerHeight > window.innerWidth) {
                if (config.settings.correctOrientation == "landscape") {
                    this._isCorrectOrientation = false;
                } else if (config.settings.correctOrientation == "portrait") {
                    this._isCorrectOrientation = true;
                }
            } else {
                if (config.settings.correctOrientation == "landscape") {
                    this._isCorrectOrientation = true;
                } else if (config.settings.correctOrientation == "portrait") {
                    this._isCorrectOrientation = false;
                }
            }

            // Call any functions which have resize type:
            for (let i = 0; i < this._functionsLib.length; i++) {
                if (this._checkIfListenersHasType(Listeners.resize, this._functionsLib[i])) {
                    this._functionsLib[i].func(...this._functionsLib[i].params);
                }
            }
        }

        /**
         * Called when page orientation is changed.
         * @private
         * @memberof Listeners
         */
        private _onOrientationChange(): void {
            // Detect whether or not in correct orientation:
            if (window.innerHeight > window.innerWidth) {
                if (config.settings.correctOrientation == "landscape") {
                    this._isCorrectOrientation = false;
                } else if (config.settings.correctOrientation == "portrait") {
                    this._isCorrectOrientation = true;
                }
            } else {
                if (config.settings.correctOrientation == "landscape") {
                    this._isCorrectOrientation = true;
                } else if (config.settings.correctOrientation == "portrait") {
                    this._isCorrectOrientation = false;
                }
            }

            // Call any functions which have orientationChange type:
            for (let i = 0; i < this._functionsLib.length; i++) {
                if (this._checkIfListenersHasType(Listeners.orientationChange, this._functionsLib[i])) {
                    this._functionsLib[i].func(...this._functionsLib[i].params);
                }
            }

            // If not correctOrientation, Call any functions which have orientationInvalid type:
            if (!this._isCorrectOrientation) {
                for (let i = 0; i < this._functionsLib.length; i++) {
                    if (this._checkIfListenersHasType(Listeners.orientationInvalid, this._functionsLib[i])) {
                        this._functionsLib[i].func(...this._functionsLib[i].params);
                    }
                }
            }

            // If is correctOrientation, Call any functions which have orientationValid type:
            if (this._isCorrectOrientation) {
                for (let i = 0; i < this._functionsLib.length; i++) {
                    if (this._checkIfListenersHasType(Listeners.orientationValid, this._functionsLib[i])) {
                        this._functionsLib[i].func(...this._functionsLib[i].params);
                    }
                }
            }
        }

        /**
         * Called when the game is interacted with, anywhere.
         * @private
         * @memberof Listeners
         */
        private _onInteraction(): void {
            // If you click on it, focus window and set visible to true .. because it probs is.
            this._isVisible = true;
            window.focus();

            // Call any functions which have interaction type:
            for (let i = 0; i < this._functionsLib.length; i++) {
                if (this._checkIfListenersHasType(Listeners.interaction, this._functionsLib[i])) {
                    this._functionsLib[i].func(...this._functionsLib[i].params);
                }
            }
        }

        /**
         * Called when the game is scrolled.
         * @private
         * @memberof Listeners
         */
        private _onScroll(): void {
            // Call any functions which have scroll type:
            for (let i = 0; i < this._functionsLib.length; i++) {
                if (this._checkIfListenersHasType(Listeners.scroll, this._functionsLib[i])) {
                    this._functionsLib[i].func(...this._functionsLib[i].params);
                }
            }
        }

        /**
         * Called when the game is scrolled.
         * @private
         * @memberof Listeners
         */
        private _onTouchMove(): void {
            // Call any functions which have touchMove type:
            for (let i = 0; i < this._functionsLib.length; i++) {
                if (this._checkIfListenersHasType(Listeners.touchMove, this._functionsLib[i])) {
                    this._functionsLib[i].func(...this._functionsLib[i].params);
                }
            }
        }

        /**
         * Called when the game is scrolled.
         * @private
         * @memberof Listeners
         */
        private _onTouchEnd(): void {
            // Call any functions which have touchEnd type:
            for (let i = 0; i < this._functionsLib.length; i++) {
                if (this._checkIfListenersHasType(Listeners.touchEnd, this._functionsLib[i])) {
                    this._functionsLib[i].func(...this._functionsLib[i].params);
                }
            }
        }
    }

    // Exported easy access singleton.
    export var listeners: Listeners = null;
}
