namespace com.sideplay.helper.tools {
	export class Control {
		private _mCB: number = -1;
		private _iC: number = -1;
		private _oC: Function = null;
		private _oCS: any = null;
		private _oCP: any[] = null;
		private _fired: boolean = false;

		/**
		 * @name constructor
		 * @description Controls multiple callbacks before running a function. Nice for making sure code runs after X unknown things
		 *              have finished. (ie animations).
		 * Creates an instance of Control.
		 * @param {number} numCallbacks
		 * @param {Function} onComplete
		 * @param {*} [ocScope]
		 * @param {...any[]} params
		 * @memberof Control
		 */
		public constructor(numCallbacks: number, onComplete: Function, ocScope?: any, ...params: any[]) {
			// Assign the total number of callbacks required.
			this._mCB = numCallbacks;

			// Assign what happens when control fires.
			this._oC = onComplete;

			// Initialise internal count.
			this._iC = 0;

			// Assign scope and params if they are defined.
			ocScope != undefined ? (this._oCS = ocScope) : (this._oCS = null);
			params != [] ? (this._oCP = params) : (this._oCP = null);

			// Developer log.
			if (config.settings.developerMode) {
				console.log('[Control.ts] Control started awaiting', this._mCB, 'callbacks.');
			}
		}

		/**
		 * @name done
		 * @description Calls done to say one callback has finished.
		 * @memberof Control
		 */
		public done(): void {
			if (!this._fired) {
				this._iC++;
				if (this._iC == this._mCB) {
					if (config.settings.developerMode) {
						console.log('[Control.ts] Control Firing! :', this._iC, '/', this._mCB, 'times.');
					}
					this._fire();
				} else if (this._iC > this._mCB) {
					if (config.settings.developerMode) {
						console.warn('[Control.ts] Control fired too many times! :', this._iC, '/', this._mCB, 'times.');
					}
				} else {
					if (config.settings.developerMode) {
						console.log('[Control.ts] Control completed', this._iC, '/', this._mCB, 'times.');
					}
				}
			}
		}

		/**
		 * @name _fire
		 * @description Calls the onComplete cuz all the dones have been called.
		 * @private
		 * @memberof Control
		 */
		private _fire(): void {
			// Fires the onComplete
			if (this._oCS == null) {
				this._oCP == null ? this._oC() : this._oC(...this._oCP);
			} else {
				this._oCP == null ? this._oC.bind(this._oCS)() : this._oC.bind(this._oCS)(...this._oCP);
			}
		}
	}
}
