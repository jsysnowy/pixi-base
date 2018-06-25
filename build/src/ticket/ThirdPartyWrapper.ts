/// <reference path="../../../typings/tsd.d.ts" />

namespace com.sideplay.ticket {
	export class ThirdPartyWrapper extends core.Wrapper {
		public constructor(thirdPartyParams: any[]) {
			super();
		}

		/**
		 * @name        requestConfig
		 * @description Grabs the config object from the phoenix.
		 * @param       {Function} sendFunction
		 * @memberof    ThirdPartyWrapper
		 */
		public requestConfig(sendFunction: Function): void {
			sendFunction(null);
		}

		/**
		 * @name        requestTicket
		 * @description Grabs the ticket object from the local assets directory.
		 * @param       {Function} sendFunction
		 * @memberof    ThirdPartyWrapper
		 */
		public requestTicket(sendFunction: Function): void {
			sendFunction(null);
		}

		/**
		 * @name            completeTicket
		 * @override        true
		 * @description:    This function is called when the games is told to complete the ticket.
		 * @memberof        ThirdPartyWrapper
		 */
		public completeTicket(): void {
			// om.camelot.core.IWG.ame('bank', {balance: 'finalAmount', log: true});
		}

		/**
		 * @name        finishGame
		 * @override    true
		 * @description This function is called when the game is finished. It must do whatever is necessary
		 *              with the 3rd party to exit the game
		 * @memberof    ThirdPartyWrapper
		 */
		public finishGame(): void {
			// com.camelot.core.IWG.ame('closeGame');
		}

		/**
		 * @name           prizeRevealed
		 * @description    Calls the banking function.
		 * @param {number} amt The amount to be passed into the banking call.
		 * @memberof       ThirdPartyWrapper
		 */
		public prizeRevealed(amt: number): void {
			// com.camelot.core.IWG.ame("bank", {deposit: [amt], log: true});
		}
	}
}
