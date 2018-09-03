namespace com.sideplay.core {
    export class TicketManager {
        //#region Singleton instance
        /**
         * Stores the singleton instance of TicketManager.
         * @static
         * @type {TicketManager}
         * @memberof TicketManager
         */
        public static instance: TicketManager = null;
        //#endregion
        // Internal Variables.
        // - Config settings.
        private _configLock: boolean = false;
        private _configObject: ticket.IConfig = null;
        private _configLoaded: boolean = false;

        // - TicketManager settings.
        private _ticketLock: boolean = false;
        private _ticketObject: ticket.ITicket = null;
        private _ticketLoaded: boolean = false;

        // - Wrapper settings.
        private _runningLocal: boolean = false;
        private _wrapper: Wrapper = null;

        // - Request settings.
        private _requestLock: boolean = false;
        private _requestCallback: Function = null;
        private _requestScope: any = null;
        private _requestParams: any[] = null;
        private _trigger: boolean = false;

        // - Player bank settings
        private _playerWinnings: number = null;
        private _playerWonPrize: boolean = null;

        /**
         * @name constructor
         * @description Creates an instance of TicketManager.
         * @memberof TicketManager
         * @param {...any[]} thirdPartyParams
         * @memberof TicketManager
         */
        public constructor(thirdPartyParams: any[]) {
            if (TicketManager.instance == null) {
                // Setup singleton instance.
                TicketManager.instance = core.ticket = this;

                // Setup initial wrapper.
                if (thirdPartyParams[0] == "local") {
                    this._wrapper = new sideplay.ticket.LocalWrapper();
                } else {
                    this._wrapper = new sideplay.ticket.ThirdPartyWrapper(thirdPartyParams);
                }
            } else {
                window.parent.postMessage("game.error", "*");
                console.error(
                    "Cannot create multiple instances of TicketManager. Please use core.TicketManager.instance or core.ticket instead."
                );
            }
        }

        // - Game Configuration -

        /**
         * @name requestConfig
         * @description Requests a configuration object from the wrapper.
         * @param {Function} [callback]
         * @param {*} [scope]
         * @param {...any[]} params
         * @memberof TicketManager
         */
        public requestConfig(callback?: Function, scope?: any, ...params: any[]): void {
            // Makes sure there arent any pending requests.
            if (!this._requestLock) {
                // Locks request access until this operation is complete.
                this._requestLock = true;

                // Stores request completed stuff.
                callback != null ? (this._requestCallback = callback) : (this._requestCallback = null);
                scope != null ? (this._requestScope = scope) : (this._requestScope = null);
                params != [] ? (this._requestParams = params) : (this._requestParams = null);
                this._trigger = true;

                // Calls request for config object through wrapper.
                this._wrapper.requestConfig(e => {
                    this._setConfig(e);
                });
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot request config whilst another request is already in progress.");
            }
        }

        /**
         * @name _setConfig
         * @description Sets the configuration object.
         * @private
         * @param {ticket.IConfig} configIN
         * @memberof TicketManager
         */
        private _setConfig(configIN: ticket.IConfig): void {
            // Only set the config if theres a request lock. Stops anyone manually setting this with a custom object.
            //console.log(this._requestLock);
            if (this._requestLock) {
                this._configObject = configIN;
                this._configLoaded = true;
                this._requestLock = false;
                this._callRequestCallback();
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot set the config without doing it through a request.");
            }
        }

        /**
         * @name getConfig
         * @description Returns the loaded configuration object.
         * @returns {ticket.IConfig}
         * @memberof TicketManager
         */
        public getConfig(): ticket.IConfig {
            if (this._configLoaded) {
                return this._configObject;
            } else {
                throw new Error("Cannot get config information because the config isn't loaded.");
            }
        }

        // - Game TicketManager --

        /**
         * @name requestTicket
         * @description Requests a ticket through the loaded wrapper.
         * @param {Function} [callback]
         * @param {*} [scope]
         * @param {...any[]} params
         * @memberof TicketManager
         */
        public requestTicket(callback?: Function, scope?: any, ...params: any[]): void {
            // Makes sure there arent any pending requests.
            if (!this._requestLock) {
                // Locks request access until this operation is complete.
                this._requestLock = true;

                // Stores request completed stuff.
                callback != null ? (this._requestCallback = callback) : (this._requestCallback = null);
                scope != null ? (this._requestScope = scope) : (this._requestScope = null);
                params != [] ? (this._requestParams = params) : (this._requestParams = null);
                this._trigger = true;

                // Calls request for ticket object through wrapper.
                this._wrapper.requestTicket(e => {
                    this._setTicket(e);
                });
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot request ticket whilst another request is already in progress.");
            }
        }

        /**
         * @name _setTicket
         * @description Sets the ticket object.
         * @private
         * @param {ticket.ITicket} ticketIN
         * @memberof TicketManager
         */
        private _setTicket(ticketIN: ticket.ITicket): void {
            // Only set the config if theres a request lock. Stops anyone manually setting this with a custom object.
            if (this._requestLock) {
                // Tell core.ticket a ticket is now loaded in.
                this._ticketObject = ticketIN;
                this._ticketLoaded = true;
                this._requestLock = false;

                // Reset player bank amounts
                this._playerWinnings = 0;
                this._playerWonPrize = false;

                // Callback to continue with game.
                this._callRequestCallback();
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot set the ticket without doing it through a request.");
            }
        }

        /**
         * @name getTicket
         * @description Returns the loaded ticket object.
         * @returns {ticket.IConfig}
         * @memberof TicketManager
         */
        public getTicket(): ticket.ITicket {
            if (this._ticketLoaded) {
                return this._ticketObject;
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot get ticket information because the ticket isn't loaded.");
            }
        }

        /**
         * @name gameLoaded
         * @description Called once the game has announed its finished loading all assets/configurations/ticket.
         * @memberof TicketManager
         */
        public gameLoaded(): void {
            if (this._ticketLoaded) {
                // Tell wrapper the player won this prize.
                this._wrapper.gameLoaded();
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot call gameLoaded ticket isn't loaded.");
            }
        }

        /**
         * @name gameStarted
         * @description Called once the player starts playing the game.
         * @memberof TicketManager
         */
        public gameStarted(): void {
            if (this._ticketLoaded) {
                // Tell wrapper the player won this prize.
                this._wrapper.gameStarted();
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot call gameStarted ticket isn't loaded.");
            }
        }

        /**
         * @name prizeRevealed
         * @description Called when the player reveals a prize! Tells the wrapper a prize has been won by the user.
         * @param {*} amount
         * @memberof TicketManager
         */
        public prizeRevealed(amount: number): void {
            if (this._ticketLoaded) {
                // Add the amount revealed to player winnings, and set playerWon to true.
                this._playerWinnings += amount;
                this._playerWonPrize = true;

                // Tell wrapper the player won this prize.
                this._wrapper.prizeRevealed(amount);
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot reveal prize as a ticket isn't loaded.");
            }
        }

        /**
         * @name gameError
         * @description Called if the game errors.
         * @param {string} message
         * @memberof TicketManager
         */
        public gameError(message: string): void {
            if (this._ticketLoaded) {
                // Tell wrapper the player won this prize.
                this._wrapper.gameError(message);
            }
        }

        // - Completing/Finishing Tickets -
        /**
         * @name completeTicket
         * @description Called when the game has finished with a ticket. The TicketManager will dump all known ticket informantion and
         *              reset internal variables ready for a new ticket or finishgame request.
         * @memberof TicketManager
         */
        public completeTicket(): void {
            if (!this._requestLock) {
                if (this._ticketLoaded) {
                    // Tells wrapper to do complete ticket call.
                    this._wrapper.completeTicket();

                    // Dump all TicketManager data
                    this._ticketObject = null;
                    this._ticketLoaded = false;

                    // Reset player bank amounts
                    this._playerWinnings = 0;
                    this._playerWonPrize = false;
                } else {
                    core.wrapper.gameError();
                    throw new Error("Cannot complete ticket when one isn't loaded.");
                }
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot complete ticket whilst another request is in progress.");
            }
        }

        // - Game Finished -

        /**
         * @name finishGame
         * @description Call the code for the user finishing the game, and leaving the game window.
         * @memberof TicketManager
         */
        public finishGame(...any: any[]): void {
            if (!this._requestLock) {
                if (!this._ticketLoaded) {
                    // Call loader wrapper finishgame.
                    this._wrapper.finishGame(...any);
                } else {
                    core.wrapper.gameError();
                    throw new Error("Cannot finish game with a ticket loaded. Call 'core.ticket.completeTicket' first.");
                }
            } else {
                core.wrapper.gameError();
                throw new Error("Cannot finish the game whilst another request is in progress.");
            }
        }

        // - Internal Private Functions -

        /**
         * @name _callRequestCallback
         * @description Calls the request callback after a request has been completed.
         * @private
         * @memberof TicketManager
         */
        private _callRequestCallback(): void {
            // Only fire if the trigger is set, makes sure any features here are only called when necassary.
            if (this._trigger) {
                // Fires the onComplete
                this._trigger = false;
                if (this._requestScope == null) {
                    this._requestParams == null ? this._requestCallback() : this._requestCallback(...this._requestParams);
                } else {
                    this._requestParams == null
                        ? this._requestCallback.bind(this._requestScope)()
                        : this._requestCallback.bind(this._requestScope)(...this._requestParams);
                }
            }
        }
    }

    // Reference
    export var ticket: TicketManager = null;

    // Exported Wrapper template for TPR to use.
    /**
     * @name            WrapperTemplate
     * @description     The barebones template for ThirdPartyWrapper, incase a function isn't defined.
     */
    export class Wrapper {
        public static instance: Wrapper = null;
        public constructor() {
            if (Wrapper.instance == null) {
                Wrapper.instance = core.wrapper = this;
            } else {
                core.wrapper.gameError();
                console.error("Cannot make multiple Wrapper. Please use core.Wrapper.instance or core.wrapper instead.");
            }
        }
        public requestConfig(sendFunction: Function): void {
            // Override me!
        }
        public requestTicket(sendFunction: Function): void {
            // Override me!
        }
        public gameLoaded(): void {
            // Override me!
        }
        public gameStarted(): void {
            // Override me!
        }
        public gameError(message: any = ""): void {
            // Called if the game errors!
        }
        public prizeRevealed(prizeAmount: any): void {
            // Override me!
        }
        public completeTicket(...any: any[]): void {}
        public finishGame(...any: any[]): void {}
        public sendSGTData(playerTokenNum: number, onComplete: Function): void {}
    }

    // Reference
    export var wrapper: Wrapper = null;
}
