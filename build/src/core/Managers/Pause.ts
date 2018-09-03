/*
* -= Pause.ts: =-
* - Creates listeners and events to handle when the game should pause/unpause - and overlays which are applied to the game upon pausing/un-pausing.
* - Sideplay core framework file.

* - Changelog:
* - 14/4/18 - Changelog added. [Snowy]
* - 14/4/18 - Changes listeners to use listeners.ts for more accurate event handling. [Snowy]
* - 05/06/18 - Updated pause to work in iframes . mouse over on pause button auto unpause [Snowy]
* -=-
*/

namespace com.sideplay.core {
    export class Pause {
        // Stores singleton
        public static instance: Pause = null;

        // Silly toggle for debugging
        public debugging: boolean = false;

        // Internal variables
        private _paused: boolean = false;
        private _initialised: boolean = false;
        private _divGenerated: boolean = false;
        private _isMouseOver: boolean = false;

        // User defined variables
        private _pauseOnIncorrectOrientation: boolean = false;
        private _pauseOnBlur: boolean = false;
        private _pauseOnVisibilityLoss: boolean = false;

        // Overlay settings
        private _group: core.Group = null;
        private _overlayVisible: boolean = false;
        private _overlayGFX: PIXI.Graphics = null;
        private _overlayImg: PIXI.Sprite = null;
        private _isClickable: boolean = true;
        private _isStartUp: boolean = true;

        /**
         * @name pauseOnIncorrectOrientation
         * @description Get/Set game pausing when incorrect orientation..
         * @memberof Pause
         */
        public set pauseOnIncorrectOrientation(input: boolean) {
            if (this._initialised) {
                console.warn("Can't set pause settings after it's initialised. The listeners are already added!");
                return;
            }
            this._pauseOnIncorrectOrientation = true;
        }
        public get pauseOnIncorrectOrientation(): boolean {
            return this._pauseOnIncorrectOrientation;
        }

        /**
         * @name pauseOnBlur
         * @description Get/Set game pausing when game is blurred.
         * @memberof Pause
         */
        public set pauseOnBlur(input: boolean) {
            if (this._initialised) {
                console.warn("Can't set pause settings after it's initialised. The listeners are already added!");
                return;
            }
            this._pauseOnBlur = true;
        }
        public get pauseOnBlur(): boolean {
            return this._pauseOnBlur;
        }

        /**
         * @name pauseOnVisibilityLoss
         * @description Get/Set game pausing when game loses visibility.
         * @memberof Pause
         */
        public set pauseOnVisibilityLoss(input: boolean) {
            if (this._initialised) {
                console.warn("Can't set pause settings after it's initialised. The listeners are already added!");
                return;
            }
            this._pauseOnVisibilityLoss = true;
        }
        public get pauseOnVisibilityLoss(): boolean {
            return this._pauseOnVisibilityLoss;
        }

        /**
         * @name constructor
         * @description Creates an instance of Pause.
         * @memberof Pause
         */
        public constructor() {
            if (Pause.instance == null) {
                Pause.instance = core.pause = this;
            } else {
                console.error("Cannot make multiple instance of Pause. Please us core.Pause.instance or core.pause instead");
            }
        }

        /**
         * @name init
         * @description
         * @returns {boolean}
         * @memberof Pause
         */
        public init(): boolean {
            if (this._initialised) {
                console.warn("Can't initialise after it's initialised.");
                return false;
            }

            this._initGroup();

            if (config.settings.loaderType == "pixi") {
                this._setupOrientationListeners();
                this._setupBlurListeners();
                this._setupVisibilityListeners();
                this._updateGamePausedState();
            } else if (config.settings.loaderType == "phoenix") {
                this._setupPhoenixListeners();
            } else {
                console.warn("No pause events for the " + config.settings.loaderType + " loader type.");
            }
        }

        /**
         * @name group
         * @description Returns the group used in pause.
         */
        public get group(): core.Group {
            return this._group;
        }

        /**
         * @name _initGroup
         * @description Makes group for overlay.
         * @private
         * @memberof Pause
         */
        private _initGroup(): void {
            this._group = new core.Group();
            this._group.displayScaleMode = DisplayScaleMode.FILL;
        }

        /**
         * @name _setupOrientationListeners
         * @description Attaches needed listeners onto the page to pause when orientation stuff happens.
         * @private
         * @memberof Pause
         */
        private _setupOrientationListeners(): void {
            if (this._pauseOnIncorrectOrientation) {
                core.listeners.add([Listeners.resize, Listeners.orientationChange], () => {
                    this._updateGamePausedState();
                });
            }
        }

        /**
         * @name _setupBlurListeners
         * @description Sets up listeners for onblur events pausing/unpausing the game.
         * @private
         * @memberof Pause
         */
        private _setupBlurListeners(): void {
            if (this._pauseOnBlur) {
                core.listeners.add([Listeners.focusChange, Listeners.interaction], () => {
                    this._updateGamePausedState();
                });
            }
        }

        /**
         * @name _setupVisibilityListeners
         * @description Sets up listeners for visibility changes pausing/un-pausing the game.
         * @private
         * @memberof Pause
         */
        private _setupVisibilityListeners(): void {
            if (this._pauseOnVisibilityLoss) {
                core.listeners.add(Listeners.visibilityChange, () => {
                    this._updateGamePausedState();
                });
                core.listeners.add(Listeners.interaction, () => {
                    window.focus();
                    this._updateGamePausedState();
                });
                core.listeners.add(Listeners.interaction, () => {
                    window.focus();
                    this._updateGamePausedState();
                });
            }
        }

        /**
         * @name _setupPhoenixListeners
         * @description Attaches and phoenix-specific listeners.
         * @private
         * @memberof Pause
         */
        private _setupPhoenixListeners(): void {
            // Cam pause event tied to Matt's pause event.
            com.camelot.iwg.IWGEM.on(com.camelot.core.IWGEVENT.PAUSE, evt => {
                if (evt) {
                    core.game.pauseGame();
                }
            });

            // Unpause logic determined differently based off device type.
            if (bowser.mobile || bowser.tablet) {
                listeners.add(Listeners.interaction, () => {
                    this._updateGamePausedState();
                });
            } else {
                // Focus change listener
                listeners.add(Listeners.focusChange, () => {
                    this._updateGamePausedState();
                });

                // FireFox specific "click" fix...
                window.addEventListener("click", () => {
                    window.focus();
                    this._updateGamePausedState();
                });
            }
        }

        /**
         * @name _updateGamePausedState
         * @description Checks state of pausedState to see if the game should be paused or not.
         * @private
         * @memberof Pause
         */
        private _updateGamePausedState(): void {
            var shouldBePaused = false;

            // Check orientation..
            if (this._pauseOnIncorrectOrientation) {
                if (!listeners.isCorrectOrientation) {
                    shouldBePaused = true;
                }
            }

            /** TODO: add param to toggle this on/off */
            // if (device.deviceStatus().fullscreen == false) {
            //     shouldBePaused = true;
            // }

            // Check blur state
            if (this._pauseOnBlur) {
                // If the game is starting up, dont display the overlay.
                if (this._isStartUp) {
                    this._isStartUp = false;
                } else if (!listeners.isFocused) {
                    shouldBePaused = true;
                }
            }

            // Check visibility state
            if (this._pauseOnVisibilityLoss) {
                if (!listeners.isVisible) {
                    shouldBePaused = true;
                }
            }

            // Toggle to pause/unpause the game.
            if (shouldBePaused) {
                core.game.pauseGame();
            } else {
                if (!config.settings.unpauseOnClick) {
                    core.game.unpauseGame();
                } else {
                    if (this._isMouseOver) {
                        core.game.unpauseGame();
                        this._isMouseOver = false;
                    }
                }
            }
        }

        /**
         * @name displayPauseOverlay
         * @description The pause overlay over the game appears.
         * @memberof Pause
         */
        public displayPauseOverlay(): void {
            if (!this._overlayVisible) {
                // Drawn pause overlay.
                this._overlayVisible = true;

                if (config.settings.pauseOverlayType == "canvas") {
                    this._overlayGFX = new PIXI.Graphics();
                    this._overlayGFX.beginFill(0x000000, 0.2);
                    this._overlayGFX.drawRect(0, 0, config.settings.nativeWidth, config.settings.nativeHeight);
                    this._overlayGFX.interactive = this._isClickable;
                    this._group.addChild(this._overlayGFX);

                    let pauseIcon = core.factory.anchoredsprite(0, 0, "pause");
                    pauseIcon.position = helper.world.center;
                    this._overlayGFX.addChild(pauseIcon);

                    if (config.settings.unpauseOnClick) {
                        pauseIcon.interactive = true;
                        pauseIcon.cursor = "pointer";
                        pauseIcon.on(Interaction.pointerdown, e => {
                            if (pauseIcon.getBounds().contains(e.data.global.x, e.data.global.y)) {
                                this._isMouseOver = true;
                            } else {
                                this._isMouseOver = false;
                            }
                            pauseIcon.interactive = false;
                            core.game.unpauseGame();
                        });
                    }
                }

                // CSS pause overlay.
                if (config.settings.pauseOverlayType == "css") {
                    // Makes sure div is generated:
                    if (!this._divGenerated) {
                        this._generateDivOverlay();
                    }

                    // Generates a graphic over the game which prevents clicks.
                    this._overlayGFX = new PIXI.Graphics();
                    this._overlayGFX.beginFill(0x000000, 0);
                    this._overlayGFX.drawRect(0, 0, config.settings.nativeWidth, config.settings.nativeHeight);
                    this._overlayGFX.interactive = this._isClickable;
                    this._group.addChild(this._overlayGFX);

                    // Show the div using below settings.
                    let div = document.getElementById("pauseOverlay");
                    div.style.display = "block";
                    div.style.opacity = "1";
                    var pauseArea = document.getElementById("pauseIcon");
                    pauseArea.style.marginLeft = "calc( 50% - " + pauseArea.clientWidth / 2 + "px)";
                    pauseArea.style.marginTop = "calc( 50% - " + pauseArea.clientHeight / 2 + "px)";
                }

                // Do nothing. ... there is no overlay to display.
            }
        }

        /**
         * @name hidePauseOverlay
         * @description Hides the pause overlay over the game.
         * @memberof Pause
         */
        public hidePauseOverlay(): void {
            // Make sure overlay is currently visible.
            if (this._overlayVisible) {
                // Set overlay to no longer be visible.
                this._overlayVisible = false;

                // If overlayType is canvas, it's just a graphics object to destroy.
                if (config.settings.pauseOverlayType == "canvas") {
                    // Destroy overlayGfx
                    this._overlayGFX.destroy();
                }

                // If overlayType is css, it need sto destroy the overlayGfx and hide the css.
                if (config.settings.pauseOverlayType == "css") {
                    let div = document.getElementById("pauseOverlay");
                    div.style.display = "none";
                    div.style.opacity = "0";
                    this._overlayGFX.destroy();
                }

                // Else... do nothing.
            }
        }

        //================================================================================
        // Private Functions:
        //================================================================================
        /**
         * Generates a div overlay for teh pause to use.
         * @private
         * @memberof Pause
         */
        private _generateDivOverlay(): void {
            // Div holds entire thing
            let div = document.createElement("div");
            div.id = "pauseOverlay";

            // Pause icon is little button inside.
            var pauseIcon = document.createElement("div");
            pauseIcon.id = "pauseIcon";
            pauseIcon.innerHTML = '<a href="#" id="pauseClickable" class="' + config.settings.pauseClass + '">Resume</a>';

            // Add listener for clicks if required.
            if (config.settings.unpauseOnClick) {
                pauseIcon.onclick = e => {
                    // On click - it waits till next frame, then resumes the game. This fixes issue with IE11 not thinking it's visible when u click on this.
                    e.preventDefault();
                    let resumeNextFrame = () => {
                        // Remove listener for next frame.
                        TweenMax.ticker.removeEventListener("tick", resumeNextFrame);

                        // Force window to be focused, focus visible to true and unpause the game.
                        window.focus();
                        listeners.isVisible = true;
                        core.game.unpauseGame();
                        this._isMouseOver = false;
                        console.info("Mouse over is ", this._isMouseOver);
                    };

                    // This makes sure that it's called on next frame.
                    TweenMax.ticker.addEventListener("tick", resumeNextFrame);
                };

                pauseIcon.onmouseenter = e => {
                    this._isMouseOver = true;
                };
                pauseIcon.onmouseleave = e => {
                    this._isMouseOver = false;
                };
            }

            // Attach to whatever game holder.
            var gameHolder = document.getElementById(config.settings.gameParentDivID);
            gameHolder.appendChild(div);
            div.appendChild(pauseIcon);

            // Set flag that this is now generated.
            this._divGenerated = true;
        }
    }

    // Reference
    export var pause: Pause = null;
}
