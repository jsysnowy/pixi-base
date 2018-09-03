/*
* -= Game.ts: =-
* - Core PIXI.js implementation, game initialisation, Game Loop, master parent for game.
* - Sideplay core framework file.

* - Changelog:
* - 14/4/18 - Changelog added. <Snowy>
* - 14/4/18 - Listeners.ts added to Singleton Managers. <Snowy>
* - 14/4/18 - Updated way game pauses, meaning that it can't get soft-locked with soft-pause followed by pause. <Snowy>
* - 15/8/18 - Reformatted, DT lock, pausing remembers gamespeed. <Snowy>
* -=-
*/

/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../GameObjects/State.ts" />
/// <reference path="../states/core_boot.ts" />

namespace com.sideplay.core {
    export class GameManager {
        //#region Class Properties.
        //#region Singleton instance.
        /**
         * Stores the singleton instance used to reference this class.
         * @static
         * @type {GameManager}
         * @memberof GameManager
         */
        public static instance: GameManager;
        //#endregion

        //#region Rendering.
        /**
         * Stores the HTML div which the canvas is added to.
         * @private
         * @type {HTMLElement}
         * @memberof GameManager
         */
        private _gameDiv: HTMLElement;

        /**
         * Stores the renderer used via PIXI to render to the canvas.
         * @private
         * @type {*}
         * @memberof GameManager
         */
        private _renderer: any;

        /**
         * Stores the main PIXI.Container which every gameobject is added to, to be rendered.
         * @private
         * @type {PIXI.Container}
         * @memberof GameManager
         */
        private _mainStage: PIXI.Container;
        //#endregion

        //#region Managers.
        /**
         * Stores manager used to handle any errors which occur in the game.
         * @type {ErrorManager}
         * @memberof GameManager
         */
        public error: ErrorManager;

        /**
         * Stores manager used to handle storing/accessing gameObjects from one part of the game to another.
         * @type {GameObjects}
         * @memberof GameManager
         */
        public gameObjects: GameObjects;

        /**
         * Stores manager used to scale the game/canvas to fit into whatever context it's supposed to fit in.
         * @type {ScaleManager}
         * @memberof GameManager
         */
        public scale: ScaleManager;

        /**
         * Stores manager used to handle all page listeners/interactions, such as focus, orientation etc.
         * @type {Listeners}
         * @memberof GameManager
         */
        public listeners: Listeners;

        /**
         * Stores manager used to handle device specific functionality, such as fullscreen, orientation etc.
         * @type {DeviceManager}
         * @memberof GameManager
         */
        public device: DeviceManager;

        /**
         * Stores manager used to store and call events which can be used throughout the game.
         * @type {EventManager}
         * @memberof GameManager
         */
        public event: EventManager;

        /**
         * Used to add/store tags on objects and access arrays of all objects with those tags.
         * @type {Tags}
         * @memberof GameManager
         */
        public tags: Tags;

        /**
         * Stores manager used to handle all ticket information provided from client.
         * @type {TicketManager}
         * @memberof GameManager
         */
        public ticket: TicketManager;

        /**
         * Factory is a manager used to create various game objects with pre-applied params.
         * @type {Factory}
         * @memberof GameManager
         */
        public factory: Factory;

        /**
         * Manager used to handle all sounds played in the game.
         * @type {SoundManager}
         * @memberof GameManager
         */
        public sound: Managers.SoundManager;

        /**
         * Manager used to handle pause overlays on the game.
         * @type {Pause}
         * @memberof GameManager
         */
        public pause: Pause;

        /**
         * Manager used to handle any CTA/Idles.
         * @type {Idle}
         * @memberof GameManager
         */
        public idle: Idle;

        /**
         * Managed used to generate random information via a pre-seeded chance.js.
         * @type {Random}
         * @memberof GameManager
         */
        public random: Random;
        //#endregion

        //#region States.
        /**
         * Object acting as dictionary containing all states.
         * @type {Object}
         * @memberof GameManager
         */
        public states: Object;

        /**
         * Stores which state is currently in use.
         * @private
         * @type {State}
         * @memberof GameManager
         */
        private _curState: State;

        /**
         * Stores the boot state, first state ran by game.
         * @private
         * @type {State}
         * @memberof GameManager
         */
        private _boot: State;

        /**
         * Stores preloader state, contains all logic to load in assets for our game.
         * @private
         * @type {State}
         * @memberof GameManager
         */
        private _preloader: State;

        /**
         * Stores MainGame state, contains all frontend game-specific stuff.
         * @private
         * @type {State}
         * @memberof GameManager
         */
        private _maingame: State;
        //#endregion

        //#region Update properties.
        /**
         * Stores the time elapsed since the start of the game.
         * @private
         * @type {number}
         * @memberof GameManager
         */
        private _elapsedTime: number = 0;

        /**
         * Stores the time elapsed since last frame.
         * @private
         * @type {number}
         * @memberof GameManager
         */
        private _deltaTime: number = 0;

        /**
         * Stores the gamespeed the game is playing at.
         * @private
         * @type {number}
         * @default {1}
         * @memberof GameManager
         */
        private _gameSpeed: number = 1;

        /**
         * Array of functions which are to be called every frame.
         * @private
         * @type {Function[]}
         * @memberof GameManager
         */
        private _updateFunctions: Function[];
        //#endregion

        //#region Pausing.
        /**
         * Stores if the game is softPaused - meaning the game is paused due to a menu ingame open etc.
         * @private
         * @type {boolean}
         * @memberof GameManager
         */
        private _softPaused: boolean = false;

        /**
         * Stores if game is hardPaused - meaning the game is paused due to lack of focus/orientation etc.
         * @private
         * @type {boolean}
         * @memberof GameManager
         */
        private _hardPaused: boolean = false;
        //#endregion
        //#endregion

        //#region Getters/Setters.
        /**
         * Returns the element which PIXI is using to renderer onto the canvas.
         * @readonly
         * @type {*}
         * @memberof Game
         */
        public get renderer(): any {
            return this._renderer;
        }

        /**
         * Returns the main container which PIXI uses to render onto the canvas.
         * @readonly
         * @type {PIXI.Container}
         * @memberof Game
         */
        public get stage(): PIXI.Container {
            return this._mainStage;
        }
        //#endregion

        //#region Constructor
        /**
         * Creates an instance of Game.
         * @param {...any[]} thirdPartyParams
         * @memberof Game
         */
        public constructor(...thirdPartyParams: any[]) {
            if (GameManager.instance == null) {
                // Create the instance
                GameManager.instance = core.game = this;

                // Sideplay log
                let styles = [
                    "background: linear-gradient(#00ABEF, #0766ED)",
                    "border: 1px solid #454746",
                    "color: white",
                    "display: block",
                    "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)",
                    "box-shadow: 0 1px 0 rgba(0, 171, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset",
                    "line-height: 30px",
                    "text-align: center",
                    "font-weight: bold"
                ].join(";");
                console.log("%c http://www.sideplay.com/ ", styles);

                // Error wrapper for entire game - If enabled.
                if (config.settings.errorOverlay) {
                    this.error = new ErrorManager();
                }

                // Enabled developer logs if lS enabled.
                if (helper.tools.LocalStorage.store("sp_developer") == "enabled") {
                    config.settings.developerMode = true;
                    console.warn("Developer mode detected!");
                }

                // Create the renderer
                this._renderer = PIXI.autoDetectRenderer(config.settings.nativeWidth, config.settings.nativeHeight, { antialias: false });

                // Attach render to 'gameArea' div
                if (document.getElementById(config.settings.gameParentDivID) == null) {
                    this._gameDiv = document.createElement("div");
                    this._gameDiv.id = config.settings.gameParentDivID;
                    document.body.appendChild(this._gameDiv);
                } else {
                    this._gameDiv = document.getElementById(config.settings.gameParentDivID);
                }

                // Attach renderer to the gameDiv
                this._gameDiv.appendChild(this._renderer.view);
                this._renderer.view.id = config.settings.gameCanvasID;

                // Create the main stage and attach it to the renderer...
                this._mainStage = new PIXI.Container();
                this._renderer.render(this._mainStage);

                // Create the Singleton Manager classes / Managers.
                this.gameObjects = new GameObjects();
                this.event = new EventManager();
                this.scale = new ScaleManager(this._renderer, this._mainStage);
                this.listeners = new Listeners();
                this.device = new DeviceManager();
                this.tags = new Tags();
                this.random = new Random(chance.integer({ min: 1000000000, max: 9999999999 }));
                this.ticket = new TicketManager(thirdPartyParams);
                this.factory = new Factory();
                this.sound = new Managers.SoundManager();
                this.pause = new Pause();
                this.idle = new Idle();

                // Setup FSM for automatic testing
                new debug.GameStates();

                // Initialised on update stuff.
                this._updateFunctions = [];

                // Initialise pause stuff
                this._hardPaused = false;
                this._softPaused = false;

                // Inject scaleX and scaleY property into PIXI.container..
                Object.defineProperties(PIXI.Container.prototype, {
                    scaleX: {
                        get: function() {
                            // Error check to make sure it exists...
                            return this.scale.x;
                        },
                        set: function(v) {
                            this.scale.x = v;
                        }
                    },
                    scaleY: {
                        get: function() {
                            // Error check to make sure it exists...
                            return this.scale.y;
                        },
                        set: function(v) {
                            this.scale.y = v;
                        }
                    }
                });

                // Creates the games states
                this.states = {};
                this._boot = new state.Boot("boot");
                this._preloader = new state.Preloader("preloader");
                this._maingame = new state.MainGame("maingame");

                // Begin tracking deltaTime
                this._elapsedTime = Date.now();
                this._deltaTime = 0;

                // Gameloop uses tweenmax ticker to control.
                TweenMax.ticker.addEventListener("tick", () => {
                    this.updateGameLoop();
                });

                this.switchState("boot");
                // End Game initialisation.
            } else {
                console.error("Cannot make multiple instance of Game. Please us core.Game.instance or core.game instead");
                return;
            }
        }
        //#endregion

        //#region Public functions.
        /**
         * Sets the developerMode flag to enabled.
         * @memberof Game
         */
        public enableDeveloperMode(): void {
            helper.tools.LocalStorage.store("sp_developer", "enabled");
            config.settings.developerMode = true;
        }

        /**
         * Sets the developerMode flag to disabled.
         * @memberof Game
         */
        public disableDeveloperMode(): void {
            helper.tools.LocalStorage.store("sp_developer", "disabled");
            config.settings.developerMode = false;
        }

        /**
         * Sets the value of gameSpeed, the rate at which the game plays out.
         * @param {number} value
         * @memberof GameManager
         */
        public setGameSpeed(value: number): void {
            this._gameSpeed = value;
            TweenMax.globalTimeScale(this._gameSpeed);
        }

        /**
         * The game loop updates, all in-game stuff changes, updates called and then the scene is re-rendered.
         * @memberof Game
         */
        public updateGameLoop(): void {
            // Update deltaTime
            let now = Date.now();
            this._deltaTime = (now - this._elapsedTime) * 0.001 * TweenMax.globalTimeScale();
            this._elapsedTime = now;

            // If paused, just keep dT as 0:
            if (this._hardPaused || this._softPaused) {
                this._deltaTime = 0;
            }

            // If thread was held for ages; this stops dT progressing and slippingkey anims
            if (this._deltaTime > 0.2) {
                this._deltaTime = 0.016;
            }

            // Updates all functions attached if game isn't paused.
            for (let i = 0; i < this._updateFunctions.length; i++) {
                this._updateFunctions[i](this._deltaTime);
            }

            // Renders the game.
            this._renderer.render(this._mainStage);
        }

        /**
         * Switches the games state to the chosen state...
         * @param {string} switchName
         * @memberof Game
         */
        public switchState(switchName: string): void {
            if (this._curState != null) {
                this._mainStage.removeChild(this._curState);
                this._curState.destroy();
            }
            this._curState = this.states[switchName];
            this._mainStage.addChild(this._curState);
            this._curState.create();
        }

        /**
         * Adds something to the main renderer context.
         * @param {*} obj
         * @memberof Game
         */
        public add(obj: any): void {
            this._mainStage.addChild(obj);
        }

        /**
         * Adds a function to be called every update. Will automatically be passed a time param...
         * @param {Function} func
         * @memberof Game
         */
        public addUpdateFunction(func: Function): void {
            this._updateFunctions.push(func);
        }

        /**
         * Removes the passed update function from the update calls.
         * @param {Function} func
         * @memberof Game
         */
        public removeUpdateFunction(func: Function): void {
            for (let i = 0; i < this._updateFunctions.length; i++) {
                if (func == this._updateFunctions[i]) {
                    this._updateFunctions.splice(i, 1);
                    i--;
                }
            }
        }

        /**
         * Pauses the game, softPaused is for ingame pausing such as instructions/settings etc.
         * @param {boolean} [soft=false]
         * @returns {void}
         * @memberof GameManager
         */
        public pauseGame(soft: boolean = false): void {
            // Toggle for softpause or hardpause:
            if (soft) {
                //If it was already softpaused.. don't do it again
                if (this._softPaused) {
                    return;
                }

                // Set flags
                this._softPaused = true;

                // Soft pause only pauses stuff which isn't inside a core.Group with isPausable set to true.
                TweenMax.getAllTweens(true).forEach(tween => {
                    // Finds the object being tweened based on type of tween currently being processed:
                    let inception;
                    if (tween instanceof TimelineMax || tween instanceof TimelineLite) {
                        if ((<any>tween)._recent.target instanceof Array) {
                            inception = (<any>tween)._recent.target[0];
                        } else {
                            inception = (<any>tween)._recent.target;
                        }
                    } else if (tween.target instanceof Array) {
                        inception = tween.target[0];
                    } else {
                        inception = tween.target;
                    }

                    // Check if objects belongs to a non-paused group:
                    let nonPauser = false;
                    while (inception != null) {
                        if (inception.isPausable != null) {
                            if (!inception.isPausable) {
                                nonPauser = true;
                                inception = null;
                            } else {
                                inception = inception.parent;
                            }
                        } else {
                            inception = inception.parent;
                        }
                    }

                    // If the tween was not in a a nonPauser group; it will pause it.
                    if (!nonPauser) {
                        tween.timeScale(0);
                    }
                });

                // Pauses all delayedCalls:
                TweenMax.pauseAll(false, true, true);
            } else {
                // Make sure this is only called if not already hardPaused
                if (this._hardPaused) {
                    return;
                }

                // Set flags:
                this._hardPaused = true;

                // Store current value of globalTimeScale for use when unpausing.
                this._gameSpeed = TweenMax.globalTimeScale();

                // Set globalTimeScale to 0 - entire game is now completely frozen:
                TweenMax.globalTimeScale(0);

                // Pause all audio:
                core.sound.pause();

                // Pause screen is displayed:
                core.pause.displayPauseOverlay();
            }
        }

        /**
         * Unpauses the game, soft is for unpausing a soft state.
         * @param {boolean} [soft=false]
         * @memberof GameManager
         */
        public unpauseGame(soft: boolean = false): void {
            if (soft) {
                // Set flags:
                this._softPaused = false;

                // Loop over each tween and set timescale to 1:
                TweenMax.getAllTweens(true).forEach(tween => {
                    // Each tween set to timescale: 1
                    tween.timeScale(1);
                });

                // Unpause delayedCalls:
                TweenMax.resumeAll(false, true, true);
            } else {
                // Set flags:
                this._hardPaused = false;

                // Set globalTimeScale to 1, making game now active again:
                TweenMax.globalTimeScale(this._gameSpeed);

                // Resume audio:
                core.sound.unpause();

                // Hides the pause overlay ontop of the game.
                core.pause.hidePauseOverlay();
            }
        }
        //#endregion
    }

    // Reference
    export var game: GameManager = null;
}
