/// <reference path="../../../typings/tsd.d.ts" />

namespace com.sideplay.debug {
	export class States {
		public static gameLoaded = 'gameLoaded';
		public static prizeSet = 'prizeSet';
		public static symbolsLoaded = 'symbolsLoaded';
		public static playerSelectedSymbol = 'playerSelectedSymbol';
		public static gameEnded = 'gameEnded';
		public static gameSuccess = 'gameSuccess';
		public static gameError = 'gameError';
	}

	export class GameStates {
		// Class Field

		/**
		 * @name GameStates
		 * @description Creates an instance of GameStates.
		 * @memberof GameStates
		 */
		public constructor() {
			debug.gs = this;
		}

		public addAutomatedStates() {
			// Called once game is loaded.
			var gameLoaded = fsm.addState(States.gameLoaded);

			// Called when the prize awarded to the player is set.
			var prizeSet = fsm.addState(States.prizeSet);
			prizeSet.setUnitTests((prizeSet: number, ticket: Object) => {
				prizeSet.should.be.a('number').and.equal(core.ticket.getTicket().prize);
				ticket.should.have.property('turns').which.is.an('Array');
			});

			var symbolsLoaded = fsm.addState(States.symbolsLoaded);
			symbolsLoaded.setUnitTests((turns: number[]) => {
				(turns.length == 7 || turns.length == 6).should.be.true;
			});

			var playerSelectedSymbol = fsm.addState(States.playerSelectedSymbol);
			playerSelectedSymbol.setUnitTests((symbolSelected: number) => {
				symbolSelected.should.be
					.a('number')
					.and.be.greaterThan(-1)
					.and.be.lessThan(12);
			});

			var gameSuccess = fsm.addState(States.gameSuccess);
			gameSuccess.setRequiredAction(() => {
				core.ticket.completeTicket();
				core.ticket.finishGame(true);
			});
		}
	}

	// Reference
	export var gs: GameStates = null;
}
