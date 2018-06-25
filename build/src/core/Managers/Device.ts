/*
* -= Device.ts: =-
* - Adds and manages all Device-specific functionality, including but not limited to: Fullscreen swipe-up, orientation overlays.
* - Sideplay core framework file.

* - Changelog:
* - 14/4/18 - Changelog added. [Snowy]
* - 14/4/18 - Updates some listeners to use Listeners.ts (Some remain as they are very specific) [Snowy]
* - 14/4/18 - _currentlyFullscreen variable now correctly set to true.  [Snowy]
* - 16/4/18 - Added implementation to have a listener on the page which will check orientation whenever innerWidth/innerHeight changes..  [Snowy]
* -=-
*/

namespace com.sideplay.core {
    export class Device {
        //================================================================================
        // Singleton/Statics:
        //================================================================================
        public static instance: Device = null; // Stores the singleton instance for Device.

        //================================================================================
        // Customisable Class Params:
        //================================================================================

        //================================================================================
        // Non-Customisable Class Params:
        //================================================================================
        /* General Settings */
        private _pauseOnIncorrect: boolean = false; // Whether or not the game will pause when not in correct setup.
        private _autoRefresh: boolean = false; // Whether or not the game will auto refresh its Scale.
        private _initialised: boolean = false; // Whether or not the devicemanager has started.
        private _gameArea: HTMLElement = null; // Stores the game area.
        private _lastKnownWH: { w: number; h: number } = { w: 0, h: 0 }; // Stores last known width and height of the game.

        /* Fullscreen variables */
        private _useFullscreen: boolean = false; // Whether or not the game expects to go fullscreen.
        private _useProperFullscreen: boolean = true; // Whether or not the game uses full fullscreen. (Android fullscreen thing).
        private _currentlyFullscreen: boolean = false; // Stores whether or not the game is currently fullscreen.
        private _fullscreenDiv: HTMLElement = null; // Stores the fullscreen div.

        /* Orientation variables */
        private _useOrientation: boolean = false; // Whether or not the game expects to be the correct orientation.
        private _currentOrientation: string = null; // Stores which orientation the device is currently held.
        private _orientationDiv: HTMLElement = null; // Stores the orientation div.
        private _useMultiOrientation: boolean = false; // Whether or not the game can be played in both orientations.

        //================================================================================
        // Getters/Setters:
        //================================================================================

        /**
         * Get/Set current state of {this._useProperFullscreen}
         * @readonly
         * @type {boolean}
         * @memberof Device
         */
        public get useProperFullscreen(): boolean {
            return this._useProperFullscreen;
        }

        /**
         * Get/Set current state of {this._useProperFullscreen}
         * @memberof Device
         */
        public set useProperFullscreen(input: boolean) {
            this._useProperFullscreen = input;
        }

        /**
         * Get/Set current state of {this._useFullScreen}
         * @type {boolean}
         * @memberof Device
         */
        public get fullscreen(): boolean {
            return this._useFullscreen;
        }

        /**
         * Get/Set current state of {this._useFullScreen}
         * @memberof Device
         */
        public set fullscreen(input: boolean) {
            this._useFullscreen = input;
        }

        /**
         * Get/Set current state of {this._useOrientation}
         * @readonly
         * @type {boolean}
         * @memberof Device
         */
        public get orientation(): boolean {
            return this._useOrientation;
        }

        /**
         * Get/Set current state of {this._useOrientation}
         * @memberof Device
         */
        public set orientation(input: boolean) {
            this._useOrientation = input;
        }

        /**
         * Get/Set current state of {this._useMultiOrientation}
         * @readonly
         * @type {boolean}
         * @memberof Device
         */
        public get multiOrientationMode(): boolean {
            return this._useMultiOrientation;
        }

        /**
         * Get/Set current state of {this._useMultiOrientation}
         * @memberof Device
         */
        public set multiOrientationMode(input: boolean) {
            this._useMultiOrientation = input;
        }

        /**
         * Get/Set current state of {this._pauseOnIncorrect}
         * @readonly
         * @type {boolean}
         * @memberof Device
         */
        public get pauseOnIncorrect(): boolean {
            return this._pauseOnIncorrect;
        }

        /**
         * Get/Set current state of {this._pauseOnIncorrect}
         * @memberof Device
         */
        public set pauseOnIncorrect(input: boolean) {
            this._pauseOnIncorrect = input;
        }

        /**
         * Get/Set current state of {this._autoRefresh}
         * @readonly
         * @type {boolean}
         * @memberof Device
         */
        public get autoRefresh(): boolean {
            return this._autoRefresh;
        }

        /**
         * Get/Set current state of {this._autoRefresh}
         * @memberof Device
         */
        public set autoRefresh(input: boolean) {
            this._autoRefresh = input;
        }

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * Creates an instance of Device.
         * @memberof Device
         */
        public constructor() {
            if (Device.instance == null) {
                Device.instance = core.device = this;
            } else {
                console.error("Cannot create multiple instances of DeviceManager. Please use core.DeviceManager.instance or core.device instead.");
            }
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * Initialises the device manager with the current setup. These values cant be changed afterwards
         * @memberof Device
         */
        public init(): void {
            if (!this._initialised) {
                // This manager has now started, values cant be changed.
                this._initialised = true;

                // Stores this games gameArea in DeviceManager
                this._gameArea = document.getElementById("gameArea");

                // Stops fullscreen on tablet. Lol.
                if (bowser.tablet) {
                    this._useFullscreen = false;
                }

                if (this._useOrientation && this._useMultiOrientation) {
                    console.warn("Can't use forced orientation and multiorientation.\nuseOrientation turned off.");
                    this._useOrientation = false;
                }

                // Sets up fullscreen overlays.
                if (this._useFullscreen) {
                    if (this._useProperFullscreen && this._supportsFullscreen()) {
                        this._addWebAPIFullscreenOverlay();
                    } else {
                        this._addFullscreenOverlay();
                    }
                }

                // Sets up orientation overlays.
                if (this._useOrientation) {
                    this._addOrientationOverlay();
                }

                // If the game is using multiorientation, set up the listeners for it.
                if (this._useMultiOrientation) {
                    this._setupMultiOrientation();
                }
            }
        }

        /**
         * Called whenever you need the DeviceManager to check and display any overlays if they are required.
         * @memberof Device
         */
        public update(): void {
            if (this._useFullscreen) {
                this._checkFullscreen();
            }
        }

        /**
         * Returns the current devices fullscreen and orientation state.
         * @returns {{ fullscreen: boolean; orientation: string }}
         * @memberof Device
         */
        public deviceStatus(): { fullscreen: boolean; orientation: string } {
            return { fullscreen: this._currentlyFullscreen, orientation: this._currentOrientation };
        }

        //================================================================================
        // Private Functions:
        //================================================================================

        /**
         * Calls the code to put the fullscreen overlay ontop of the game.
         * @private
         * @memberof Device
         */
        private _addFullscreenOverlay(): void {
            // Creates the div.
            this._fullscreenDiv = document.createElement("div");
            this._fullscreenDiv.id = "fullScreenMask";
            this._fullscreenDiv.className = "fs_off";

            // Creates the slide text and appends it to the fullscreen div.
            const slideText = document.createElement("p");
            slideText.appendChild(document.createTextNode("Swipe up to go fullscreen"));
            this._fullscreenDiv.appendChild(slideText);

            // Adds the fullscreen div to the document.
            document.body.appendChild(this._fullscreenDiv);

            this._addFullscreenListeners();
        }

        /**
         * Calls the code to put the fullscreen overlay ontop of the game that asks for tap.
         * @private
         * @memberof Device
         */
        private _addWebAPIFullscreenOverlay(): void {
            // Creates the div.
            this._fullscreenDiv = document.createElement("div");
            this._fullscreenDiv.id = "fullScreenMask";
            this._fullscreenDiv.className = "fs_off";

            // Creates the slide text and appends it to the fullscreen div.
            const slideText = document.createElement("p");
            slideText.appendChild(document.createTextNode("Tap to go fullscreen"));
            this._fullscreenDiv.appendChild(slideText);
            this._fullscreenDiv.style.height = "100%";

            // Adds the fullscreen div to the document.
            document.body.appendChild(this._fullscreenDiv);

            this._addWebAPIFullscreenListeners();
        }

        /**
         * Adds all listeners needed to trigger fullscreen changes.
         * @private
         * @memberof Device
         */
        private _addFullscreenListeners(): void {
            listeners.add([Listeners.scroll, Listeners.touchMove, Listeners.resize, Listeners.touchEnd, Listeners.visibilityLost], () => {
                this._checkFullscreen();
            });
        }

        /**
         * Adds all the web api specific fullscreen listeners.
         * @private
         * @memberof Device
         */
        private _addWebAPIFullscreenListeners(): void {
            this._fullscreenDiv.addEventListener("mousedown", () => {
                if (config.settings.developerMode) {
                    console.log("[Device.ts]._addWebAPIFullscreenListeners() `mousedown` event triggered [Device.ts]._goProperFullscreen()");
                }
                this._goProperFullscreen();
            });

            this._fullscreenDiv.addEventListener("touchdown", () => {
                if (config.settings.developerMode) {
                    console.log("[Device.ts]._addWebAPIFullscreenListeners() `touchdown` event triggered [Device.ts]._goProperFullscreen()");
                }
                this._goProperFullscreen();
            });

            window.addEventListener("resize", () => {
                if (config.settings.developerMode) {
                    console.log("[Device.ts]._addWebAPIFullscreenListeners() `rezie` event triggered [Device.ts].checkFullscreen()");
                }
                this._checkFullscreen();
            });

            window.addEventListener("visibilitychange", () => {
                if (!(document.visibilityState === "hidden")) {
                    if (config.settings.developerMode) {
                        console.log("[Device.ts]._addWebAPIFullscreenListeners() `visibilitychange` event triggered [Device.ts]._displayFullscreenOverlay()");
                    }
                    // On visibility change the browser bar will be there again so the fullscreenoverlay has to trigger
                    this._displayFullscreenOverlay();
                }
            });
        }

        /**
         * Checks whether or not the game is currently in fullscreen mode.
         * @private
         * @param {boolean} [goFull=false]
         * @memberof Device
         */
        private _checkFullscreen(goFull: boolean = false): void {
            // Gets info from window...
            const windowInnerHeight = Math.min(window.innerWidth, window.innerHeight);
            const screenHeight = Math.min(window.screen.width, window.screen.height);

            const magicRatio = 8; // <- This variable will tell us how much of the screen must be missing for
            // the code to safely assume it's a browser bar and not just a notification bar.

            // The difference in height between innerHeight and screen height.
            const difference = Math.abs(windowInnerHeight - screenHeight);

            // If the difference is smaller than the magicRatio the browserbars are off, else they're on.
            if ((100 / screenHeight) * difference > magicRatio) {
                this._displayFullscreenOverlay();
            } else {
                this._deviceInFullscreen();
            }
        }

        /**
         * Triggers the device to request a fullscreen using proper API.
         * @private
         * @memberof Device
         */
        private _goProperFullscreen(): void {
            const element: any = document.getElementById("gameCanvas");
            if (element.requestFullScreen) {
                element.requestFullScreen();
            } else if (element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            }
        }

        /**
         * Tells the device manager to display the fullscreen overlay.
         * @private
         * @memberof Device
         */
        private _displayFullscreenOverlay(): void {
            // Fixes issue on iOS where the browser bar will re-appear again if you scroll too high.
            if (window.scrollTo !== undefined) {
                window.scrollTo(0, 0);
            }

            window.removeEventListener("scroll", this._removeDefault);
            window.removeEventListener("touchmove", this._removeDefault);

            // set bool so game knows its not in fullscreen atm.
            this._currentlyFullscreen = false;

            // Display the fullscreen overlay.
            this._fullscreenDiv.className = "fs_on";
        }

        /**
         * This code gets called when the game enters fullscreen mode.
         * @private
         * @memberof Device
         */
        private _deviceInFullscreen(): void {
            // Fixes issue on iOS where the browser bar will re-appear again if you scroll too high.
            if (window.scrollTo !== undefined) {
                // window.scrollTo(0, 0);
            }

            window.addEventListener("scroll", this._removeDefault);
            window.addEventListener("touchmove", this._removeDefault);

            this._currentlyFullscreen = true;

            this._fullscreenDiv.className = "fs_off";
        }

        /**
         * Adds the orientation divs onto the window.
         * @private
         * @memberof Device
         */
        private _addOrientationOverlay(): void {
            this._orientationDiv = document.createElement("div");
            this._orientationDiv.id = "rotateDevice";
            this._orientationDiv.className = "hide";

            document.body.appendChild(this._orientationDiv);

            this._setupOrientationListeners();
        }

        /**
         * Adds listeners to when the device enters/exits the incorrect orientation.
         * @private
         * @memberof Device
         */
        private _setupOrientationListeners(): void {
            if (config.settings.gameSizeChangeListeners) {
                // Monitors changes to innerW and innerH.
                TweenMax.ticker.addEventListener("tick", () => {
                    if (this._lastKnownWH.w != window.innerWidth || this._lastKnownWH.h != window.innerHeight) {
                        this._lastKnownWH = { w: window.innerWidth, h: window.innerHeight };
                        if (listeners.isCorrectOrientation) {
                            this._gameCorrectOrientation();
                        } else {
                            this._displayOrientationOverlay();
                        }
                    }
                });
            }

            listeners.add([Listeners.resize, Listeners.orientationChange], () => {
                if (listeners.isCorrectOrientation) {
                    this._gameCorrectOrientation();
                } else {
                    this._displayOrientationOverlay();
                }
            });
        }

        /**
         * Makes the games display the orientation overlay
         * @private
         * @memberof Device
         */
        private _displayOrientationOverlay(): void {
            if (this._useProperFullscreen) {
                if ((document as any).exitFullscreen) {
                    (document as any).exitFullscreen();
                } else if ((document as any).webkitExitFullscreen) {
                    (document as any).webkitExitFullscreen();
                } else if ((document as any).mozCancelFullScreen()) {
                    (document as any).mozCancelFullScreen();
                } else if ((document as any).msExitFullscreen) {
                    (document as any).msExitFullscreen();
                }
            }

            if (config.settings.showOrientationDiv) {
                this._currentOrientation = "portrait";
                this._orientationDiv.className = "show";
                this._gameArea.className = "hide";
            }
        }

        /**
         * The game is in the correct orientation and overlay doesnt display.
         * @private
         * @memberof Device
         */
        private _gameCorrectOrientation(): void {
            if (config.settings.showOrientationDiv) {
                this._currentOrientation = "landscape";
                this._orientationDiv.className = "hide";
                this._gameArea.className = "show";
            }

            // If the game is using fullscreen manager, check to make sure it's not changed.
            if (this._useFullscreen) {
                this._checkFullscreen();
            }
        }

        /**
         * Sets up the phaser canvas to support multiple orientation mode.
         * @private
         * @memberof Device
         */
        private _setupMultiOrientation(): void {
            // Changes canvas proportions based on orientation.

            // Adds listeners onto the page
            this._setupMultiOrientationListeners();
        }

        /**
         * The game adds listeners to let it support multiple orientation modes.
         * @private
         * @memberof Device
         */
        private _setupMultiOrientationListeners(): void {
            console.warn("Multi orientation currently WIP");
        }

        /**
         * Returns whether or not the device supports fullscreen
         * @private
         * @returns {boolean}
         * @memberof Device
         */
        private _supportsFullscreen(): boolean {
            const tsfixDocument: any = document;
            return tsfixDocument.fullscreenEnabled || tsfixDocument.webkitFullscreenEnabled || tsfixDocument.mozFullScreenEnabled || tsfixDocument.msFullscreenEnabled;
        }

        /**
         * When the game is in fullscreen, stop scrolling events.
         * @private
         * @param {any} e
         * @memberof Device
         */
        private _removeDefault(e): void {
            if (e.preventDefault) {
                e.preventDefault();
            }
        }
    }

    // Reference
    export let device: Device = null;
}
