namespace com.sideplay.ticket {
    export class TestingWrapper extends core.Wrapper {
        // User defined variables
        private _configFilePath: string = null;
        private _ticketFilePath: string = null;
        private _array: boolean = false;
        private _platform: any = null;

        /**
         * @name constructor
         * @description Creates an instance of LocalWrapper.
         * @memberof LocalWrapper
         */
        public constructor() {
            super();

            this._configFilePath = "./assets/ticket/config.json";
            this._ticketFilePath = "./assets/ticket/ticket.json";

            this._platform = <any>window.top;

            this._initUnitTestResponses();
            this._scrapePageForSettings();
        }

        /**
         * @name requestConfig
         * @description Grabs the config object from the local assets directory.
         * @param {Function} sendFunction
         * @memberof LocalWrapper
         */
        public requestConfig(sendFunction: Function): void {
            this._scrapePageForSettings();
            var scrapedConfig = (<any>window.top).configString;
            core.game.pauseGame = () => {};
            core.game.unpauseGame = () => {};
            debug.gs.addAutomatedStates();

            // TODO: REMOVE THIS
            if (this._platform.testInProgress) {
                debug.fsm.enableAutomation();
            }

            debug.fsm.enableTesting();

            sendFunction(scrapedConfig);
        }

        /**
         * @name requestTicket
         * @description Grabs the ticket object from the local assets directory.
         * @param {Function} sendFunction
         * @memberof LocalWrapper
         */
        public requestTicket(sendFunction: Function): void {
            var scrapedTicket = JSON.parse((<any>window.top).ticketString);
            sendFunction(scrapedTicket);
        }

        /**
         * @name _scrapePageForSettings
         * @description Sets
         * @private
         * @memberof TestingWrapper
         */
        private _scrapePageForSettings(): void {
            TweenMax.globalTimeScale(this._platform.currentGameSpeed);
            if (this._platform.currentGameMuted) {
                core.sound.mute();
            }
            if (this._platform.currentGamePaused) {
            }
        }

        /**
         * @name _initUnitTestResponses
         * @description Initialises the responses from unit tests to the platform
         * @private
         * @memberof TestingWrapper
         */
        private _initUnitTestResponses(): void {
            debug.UnitTestResponse.setState = e => {
                this._platform.setGameState(e);
            };
            debug.UnitTestResponse.onUnitTestPassed = e => {
                this._platform.handleUnitTestResponse(debug.fsm.currentState().getKey(), true, e);
            };

            debug.UnitTestResponse.onUnitTestFailed = e => {
                this._platform.handleUnitTestResponse(debug.fsm.currentState().getKey(), false, e);
                debug.fsm.setState("gameFailed", [], [e]);
            };
        }

        /**
         * @name finishGame
         * @description The window refreshes.
         * @memberof LocalWrapper
         */
        public finishGame(success: boolean = true, ...issues: any[]): void {
            (<any>window.top).gameFinished(success, issues);
        }
    }
}
