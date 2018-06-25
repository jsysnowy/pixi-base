/**
 * @name            FSM
 * @author          Snowy Moore <snowy@sideplay.com>
 * @date            22/09/2017
 * @description     FSM, a singleton class which handles all states within the game, used for unit testing and automated testing processes.
 */
namespace com.sideplay.debug {
	class FSM {
		// Class field
		private _active: boolean = false;
		private _testing: boolean = false;
		private _states: State[] = null;
		private _currentState: State = null;

		/**
		 * @name constructor
		 * @description Creates a new instance of FSM
		 * @memberof FSM
		 */
		public constructor() {
			// Initialises default state.
			this._states = [];

			this._currentState = new State('init');
			this._states.push(this._currentState);

			// Init Chai
			if (chai != undefined) {
				chai.should();
			}

			// Set default game states
			this.defaultStates();
		}

		/**
		 * @name defaultStates
		 * @description Attatch default states to the game.
		 * @memberof FSM
		 */
		public defaultStates(): void {
			// On game unit test fail...
			var gameFailed = this.addState('gameFailed');
			gameFailed.setRequiredAction(e => {
				core.ticket.completeTicket();
				core.ticket.finishGame(false, e);
			});

			// On game error...
			var gameError = this.addState('gameError');
			gameError.setRequiredAction(() => {
				core.ticket.completeTicket();
				core.ticket.finishGame();
			});
		}

		/**
		 * @name enableAutomation
		 * @description Enables the automation of the game...
		 * @memberof FSM
		 */
		public enableAutomation(): void {
			this._active = true;
			this._currentState.activate(false, true);
		}

		/**
		 * @name enableTesting
		 * @description Enables Unit testing everytime a state is hit via Chai.
		 * @memberof FSM
		 */
		public enableTesting(): void {
			if (chai != undefined) {
				this._testing = true;
				this._currentState.activate(true, false);
			}
		}

		/**
		 * @name currentState
		 * @description Return the current state in the FSM.
		 * @returns {State}
		 * @memberof FSM
		 */
		public currentState(): State {
			return this._currentState;
		}

		/**
		 * @name addState
		 * @description Adds a new state to the FSM without setting it as active.
		 * @param {string} stateKey
		 * @param {...any[]} stateParams
		 * @returns {boolean}
		 * @memberof FSM
		 */
		public addState(stateKey: string, ...stateParams: any[]): State {
			// Check if the state already exists.
			for (let i = 0; i < this._states.length; i++) {
				if (this._states[i].getKey() == stateKey) {
					console.warn('State was attempted to be made, however it already existed and has been discarded');
					return null;
				}
			}

			// Create new state and add it to list of already existing states.
			var newState = new State(stateKey, ...stateParams);
			this._states.push(newState);
			return newState;
		}

		/**
		 * @name setState
		 * @description Changes FSM to a certain state, or generates a new state - based on the inputted key, and return it.
		 * @param {string} stateKey
		 * @memberof FSM
		 */
		public setState(stateKey: string, unitTestData?: any[], activeData?: any[]): State {
			// Check if the state already exists.
			for (let i = 0; i < this._states.length; i++) {
				if (this._states[i].getKey() == stateKey) {
					this._currentState = this._states[i];
					this._currentState.setUnitTestParams(unitTestData || []);
					this._currentState.setActivationParams(activeData || []);
					this._currentState.activate(this._testing, this._active);

					// Call UnitTestResponse setState func
					UnitTestResponse.setState(this._currentState.getKey());
					return this._currentState;
				}
			}

			// Create new state and add it to list of already existing states.
			this._currentState = new State(stateKey);
			this._states.push(this._currentState);
			this._currentState.setUnitTestParams(unitTestData || []);
			this._currentState.setActivationParams(activeData || []);
			this._currentState.activate(this._testing, this._active);

			// Call UnitTestResponse setState func
			UnitTestResponse.setState(this._currentState.getKey());

			return this._currentState;
		}

		/**
		 * @name getState
		 * @description Returns State with input key, if it exists.
		 * @param {string} stateKey
		 * @returns {State}
		 * @memberof FSM
		 */
		public getState(stateKey: string): State {
			// Search for state with selected key.
			for (let i = 0; i < this._states.length; i++) {
				if (this._states[i].getKey() == stateKey) {
					// Return state if it's found
					return this._states[i];
				}
			}

			// Return null if state isn't found.
			return null;
		}
	}

	class State {
		// Class field
		private _classKey: string = null;
		private _unitTestParams: any[] = null;
		private _activationParams: any[] = null;
		private _testFunction: Function = null;
		private _requiredAction: Function = null;
		private _context: any = null;

		/**
		 * @name State
		 * @description Creates an instance of State.
		 * @param {string} key
		 * @param {...any[]} stateParams
		 * @memberof State
		 */
		public constructor(key: string, ...params: any[]) {
			this._classKey = key;
			this._unitTestParams = params;
		}

		/**
		 * @name getKey
		 * @description Returns this states key.
		 * @returns {string}
		 * @memberof State
		 */
		public getKey(): string {
			return this._classKey;
		}

		/**
		 * @name setUnitTestParams
		 * @description Sets a new value for this states params.
		 * @param {...any[]} stateParams
		 * @memberof State
		 */
		public setUnitTestParams(params: any[]): void {
			this._unitTestParams = params;
		}

		/**
		 * @name setUnitTests
		 * @description Sets unit test function to be called once this state is hit.
		 * @param {Object} expected
		 * @memberof State
		 */
		public setUnitTests(unitTest: Function): void {
			this._testFunction = unitTest;
		}

		/**
		 * @name setRequiredAction
		 * @description Sets a function which will be triggered upon entering this state.
		 * @param {Function} required
		 * @param {*} [context]
		 * @param {...any[]} params
		 * @memberof State
		 */
		public setRequiredAction(required: Function, context?: any): void {
			// Sets all variables passed.
			this._requiredAction = required;
			if (context !== undefined) {
				this._context = context;
			}
		}

		/**
		 * @name setActivationParams
		 * @description Sets a new value for this states params.
		 * @param {...any[]} stateParams
		 * @memberof State
		 */
		public setActivationParams(...params: any[]): void {
			this._activationParams = params;
		}

		/**
		 * @name activate
		 * @description This state becomes active, will run tests and fire any required actions.
		 * @returns {boolean}
		 * @memberof State
		 */
		public activate(test: boolean = true, automate: boolean = true): boolean {
			// Checks if expected and current values are present to run tests.
			if (test) {
				if (this._testFunction != null) {
					try {
						this._testFunction(...this._unitTestParams);
						UnitTestResponse.onUnitTestPassed('Passed.');
					} catch (e) {
						UnitTestResponse.onUnitTestFailed(e);
						return;
					}
				}
			}

			// Fires any required actions tied to this state becoming active.
			if (automate) {
				if (this._requiredAction !== null) {
					if (this._context !== null) {
						this._requiredAction.bind(this._context)(...this._activationParams);
					} else {
						this._requiredAction(...this._activationParams);
					}
				}
			}

			return true;
		}
	}

	// Accesesable variable.
	export var fsm = new FSM();
}
