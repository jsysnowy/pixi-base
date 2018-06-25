/*
* -= Game.ts: =-
* - Core PIXI.js implementation, game initialisation, Game Loop, master parent for game.
* - Sideplay core framework file.

* - Changelog:
* - 14/04/18 - Changelog added. [Snowy]
* - 14/04/18 - Listeners.ts added to Singleton Managers. [Snowy]
* - 14/04/18 - Updated way game pauses, meaning that it can't get soft-locked with soft-pause followed by pause. [Snowy]
* - 16/06/18 - Added Reference ordering at top of file.
* -=-
*/

// Reference ordering:
/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../Features/State.ts" />
/// <reference path="../states/core_boot.ts" />
/// <reference path="../states/core_preloader.ts" />
/// <reference path="../states/core_maingame.ts" />

namespace com.sideplay.core {
    export class Game {
        //================================================================================
        // Singleton/Static:
        //================================================================================
        public static instance: Game = null;

        //================================================================================
        // Customisable Class Params:
        //================================================================================
        public static NATIVE_WIDTH: number = -1;
        public static NATIVE_HEIGHT: number = -1;

        //================================================================================
        // Non-Customisable Class Params:
        //================================================================================
        /* PIXI main game objects */
        private _gameDiv: HTMLElement = null;
        private _renderer: any = null;
        private _mainStage: PIXI.Container = null;

        /* Public access managers */
        public error: ErrorManager = null;
        public gameObjects: GameObjects = null;
        public scale: Scale = null;
        public listeners: Listeners = null;
        public device: Device = null;
        public event: Events = null;
        public tags: Tags = null;
        public ticket: Ticket = null;
        public factory: Factory = null;
        public sound: Sound = null;
        public pause: Pause = null;
        public idle: Idle = null;
        public random: Random = null;

        /* Holds the states for the game. */
        public states: Object = null;
        private _curState: State = null;
        private _boot: State = null;
        private _preloader: State = null;
        private _maingame: State = null;

        /* Functions called on update */
        private _elapsedTime: number = 0;
        private _deltaTime: number = 0;
        private _updateFunctions: Function[] = null;

        /* Pause feature */
        private _paused: boolean = false;
        private _softPaused: boolean = false;
        private _unPausedTweens: Tween[] = null;

        //================================================================================
        // Getters/Setters:
        //================================================================================
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

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * Creates an instance of Game.
         * @param {...any[]} thirdPartyParams
         * @memberof Game
         */
        public constructor(...thirdPartyParams: any[]) {
            if (Game.instance == null) {
                // Create the instance
                Game.instance = core.game = this;

                // Sideplay log
                let styles = ["background: linear-gradient(#00ABEF, #0766ED)", "border: 1px solid #454746", "color: white", "display: block", "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)", "box-shadow: 0 1px 0 rgba(0, 171, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset", "line-height: 30px", "text-align: center", "font-weight: bold"].join(";");
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

                // Grabs/Sets NW/NH from config
                Game.NATIVE_HEIGHT = config.settings.nativeHeight;
                Game.NATIVE_WIDTH = config.settings.nativeWidth;

                // Create the renderer
                this._renderer = PIXI.autoDetectRenderer(Game.NATIVE_WIDTH, Game.NATIVE_HEIGHT, { antialias: false });

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
                this.event = new Events();
                this.scale = new Scale(this._renderer, this._mainStage);
                this.listeners = new Listeners();
                this.device = new Device();
                this.tags = new Tags();
                this.random = new Random(chance.integer({ min: 1000000000, max: 9999999999 }));
                this.ticket = new Ticket(thirdPartyParams);
                this.factory = new Factory();
                this.sound = new Sound();
                this.pause = new Pause();
                this.idle = new Idle();

                // Setup FSM for automatic testing
                new debug.GameStates();

                // Initialised on update stuff.
                this._updateFunctions = [];

                // Initialise pause stuff
                this._paused = false;
                this._unPausedTweens = [];

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

        //================================================================================
        // Public Functions:
        //================================================================================

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
         * The game loop updates, all in-game stuff changes, updates called and then the scene is re-rendered.
         * @memberof Game
         */
        public updateGameLoop(): void {
            // Update deltaTime
            let now = Date.now();
            this._deltaTime = (now - this._elapsedTime) * 0.001 * TweenMax.globalTimeScale();
            this._elapsedTime = now;

            // Updates all functions attached if game isn't paused.
            if (!this._paused) {
                for (let i = 0; i < this._updateFunctions.length; i++) {
                    this._updateFunctions[i](this._deltaTime);
                }
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
            this._curState.preload();
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
         * Pauses the game.
         */
        public pauseGame(soft: boolean = false): void {
            if (this._paused == true) {
                if (!soft) {
                    core.pause.displayPauseOverlay();
                    TweenMax.pauseAll(true, true, true);
                }
                return;
            }
            if (soft) {
                if (this._softPaused) {
                    return;
                }
                this._softPaused = true;
                // Stores all non-paused tweens... so it knows what to unpause.
                TweenMax.getAllTweens(true).forEach(tween => {
                    // Check if tween it nor already paused...
                    if (!tween.paused()) {
                        this._unPausedTweens.push(tween);
                    }
                    // Check if tween belongs in a non-pausing group.
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
                    // Check if any parent is a non-pauser...
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
                    if (!nonPauser) {
                        tween.pause();
                    }
                });

                this._paused = true;
                TweenMax.pauseAll(false, true, false);
                this.sound.pause();
            } else {
                TweenMax.getAllTweens(true).forEach(tween => {
                    if (!tween.paused()) {
                        this._unPausedTweens.push(tween);
                    }
                });

                this._paused = true;
                TweenMax.pauseAll(true, true, true);
                this.sound.pause();

                if (!soft) {
                    core.pause.displayPauseOverlay();
                }
            }
        }

        /**
         * forcePause
         * Forces the game to pause.
         */
        public forcePause() {
            TweenMax.getAllTweens(true).forEach(tween => {
                if (!tween.paused()) {
                    this._unPausedTweens.push(tween);
                }
            });

            this._paused = true;
            TweenMax.pauseAll(true, true, true);
            this.sound.pause();
            core.pause.displayPauseOverlay();
        }

        /**
         * Un-Pauses the game.
         * @memberof Game
         */
        public unpauseGame(soft: boolean = false): void {
            if (this._paused == false) {
                return;
            }
            if (soft == true) {
                this._softPaused = false;
                this._paused = false;
                TweenMax.resumeAll(false, true, false);
                this.sound.unpause();

                // Resumes all non-paused tweens.
                this._unPausedTweens.forEach(tween => {
                    tween.resume();
                });
                this._unPausedTweens = [];
            } else {
                // Unpause everything
                this._paused = false;
                TweenMax.resumeAll(true, true, true);
                this.sound.unpause();

                // Resumes all non-paused tweens.
                this._unPausedTweens.forEach(tween => {
                    tween.resume();
                });
                this._unPausedTweens = [];

                if (this._softPaused) {
                    this.pauseGame(true);
                }
            }

            core.pause.hidePauseOverlay();
        }

        /**
         * forceUnpause
         * forces the game to unpause.
         */
        public forceUnpause(): void {
            this._paused = false;
            TweenMax.resumeAll(false, true, false);
            this.sound.unpause();

            // Resumes all non-paused tweens.
            this._unPausedTweens.forEach(tween => {
                tween.resume();
            });
            this._unPausedTweens = [];

            core.pause.hidePauseOverlay();
        }

        //================================================================================
        // Private Functions:
        //================================================================================
    }

    // Reference
    export var game: Game = null;
}
