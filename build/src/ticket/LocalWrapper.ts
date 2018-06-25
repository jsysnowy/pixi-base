namespace com.sideplay.ticket {
    export class LocalWrapper extends core.Wrapper {
        // User defined variables
        private _configFilePath: string = null;
        private _ticketFilePath: string = null;
        private _array: boolean = false;
        private _currentBalance: number = 0;

        /**
         * @name constructor
         * @description Creates an instance of LocalWrapper.
         * @memberof LocalWrapper
         */
        public constructor() {
            super();

            this._configFilePath = "./assets/ticket/config.json";
            this._ticketFilePath = "./assets/ticket/ticket.json";
        }

        /**
         * @name requestConfig
         * @description Grabs the config object from the local assets directory.
         * @param {Function} sendFunction
         * @memberof LocalWrapper
         */
        public requestConfig(sendFunction: Function): void {
            // Setup new XMLHttpRequester
            var fileRequest = new XMLHttpRequest();

            // Callback for file being loaded.
            let requestListener = e => {
                var type = this._configFilePath.split(".").pop();
                if (type == "xml") {
                    //console.warn("Currently cannot parse XML. Ask Keith? :D");
                    sendFunction(helper.objects.XMLToJSON(fileRequest.responseXML));
                } else if (type == "json") {
                    var configObject = JSON.parse(fileRequest.responseText);
                    sendFunction(configObject);
                } else {
                    throw new Error("Idk what to do with a " + type + " file so i can't load the ticket.");
                }
            };

            // Request file.
            fileRequest.onload = requestListener;
            fileRequest.open("get", this._configFilePath);
            fileRequest.send();
        }

        /**
         * @name requestTicket
         * @description Grabs the ticket object from the local assets directory.
         * @param {Function} sendFunction
         * @memberof LocalWrapper
         */
        public requestTicket(sendFunction: Function): void {
            // Setup new XMLHttpRequester
            var fileRequest = new XMLHttpRequest();

            // Callback for file being loaded.
            let requestListener = e => {
                var type = this._ticketFilePath.split(".").pop();
                if (type == "xml") {
                    console.warn("Currently cannot parse XML. Ask Keith? :D");
                } else if (type == "json") {
                    var ticketObject = JSON.parse(fileRequest.responseText);
                    if (Object.keys(ticketObject)[0] == "ticketsArr") {
                        var randomTicket = ticketObject.ticketsArr[chance.integer({ min: 0, max: ticketObject.ticketsArr.length - 1 })];
                        sendFunction(randomTicket);
                    } else {
                        sendFunction(ticketObject);
                    }
                } else {
                    throw new Error("Idk what to do with a " + type + " file so i can't load the ticket.");
                }
            };

            // Request file.
            fileRequest.onload = requestListener;
            fileRequest.open("get", this._ticketFilePath);
            fileRequest.send();
        }

        /**
         * @name finishGame
         * @description The window refreshes.
         * @memberof LocalWrapper
         */
        public finishGame(): void {
            window.location.reload();
        }

        /**
         * @name prizeRevealed
         * @description Add to the current amount the game has currently "banked"
         * @param amt The amount to be "banked"
         */
        public prizeRevealed(amt: number): void {
            this._currentBalance += amt;
        }
    }
}
